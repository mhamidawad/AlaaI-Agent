import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
from scipy.signal import welch
import os

def analyze_wav_file(file_path):
    """
    Performs deep analysis on a WAV file, visualizing its waveform,
    spectrogram, and power spectral density (PSD).

    Args:
        file_path (str): The path to the WAV file.
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    print(f"Analyzing file: {file_path}")

    try:
        # Load the audio file
        # sr=None preserves the original sampling rate
        y, sr = librosa.load(file_path, sr=None)
        print(f"Audio loaded successfully. Sampling Rate: {sr} Hz, Duration: {len(y)/sr:.2f} seconds")

        # --- Time Domain Analysis: Waveform ---
        plt.figure(figsize=(14, 6))
        plt.subplot(3, 1, 1) # 3 rows, 1 column, 1st plot
        librosa.display.waveshow(y, sr=sr, x_axis='time')
        plt.title('Waveform (Time Domain)')
        plt.xlabel('Time (s)')
        plt.ylabel('Amplitude')
        plt.grid(True)
        print("\n--- Waveform Analysis ---")
        print("Look for: Sudden spikes, highly regular oscillations, or unusual amplitude changes.")
        print("A whistle might appear as a very consistent, high-frequency oscillation.")

        # --- Frequency Domain Analysis: Spectrogram ---
        # Compute the Short-Time Fourier Transform (STFT)
        # n_fft: FFT window size (e.g., 2048 samples)
        # hop_length: number of samples between successive frames (e.g., 512 samples)
        # This creates a linear frequency spectrogram, good for pinpointing exact frequencies.
        D = librosa.stft(y, n_fft=2048, hop_length=512)
        S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

        plt.subplot(3, 1, 2) # 3 rows, 1 column, 2nd plot
        librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='linear', cmap='magma')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Linear Spectrogram (Frequency vs. Time)')
        plt.xlabel('Time (s)')
        plt.ylabel('Frequency (Hz)')
        plt.ylim(0, sr / 2) # Limit y-axis to Nyquist frequency
        print("\n--- Spectrogram Analysis ---")
        print("Look for: Distinct, narrow horizontal lines at specific frequencies. This is a strong indicator of a whistle.")
        print("Note the frequency (Hz) where these lines appear. They often persist throughout the audio.")


        # --- Frequency Domain Analysis: Power Spectral Density (PSD) ---
        # Welch's method for estimating Power Spectral Density
        # fs: sampling frequency
        # nperseg: length of each segment (similar to n_fft for STFT)
        # noverlap: number of points to overlap between segments
        frequencies, psd = welch(y, fs=sr, nperseg=2048, noverlap=1024)

        plt.subplot(3, 1, 3) # 3 rows, 1 column, 3rd plot
        plt.semilogy(frequencies, psd) # Use semilogy for better visualization of power distribution
        plt.title('Power Spectral Density (PSD)')
        plt.xlabel('Frequency (Hz)')
        plt.ylabel('Power/Frequency (dB/Hz)')
        plt.xlim(0, sr / 2) # Limit x-axis to Nyquist frequency
        plt.grid(True)
        print("\n--- Power Spectral Density (PSD) Analysis ---")
        print("Look for: Sharp, prominent peaks at specific frequencies. These peaks indicate dominant frequencies in the audio.")
        print("A whistle will likely show a very distinct peak at its frequency, standing out from the rest of the spectrum.")

        plt.tight_layout() # Adjust subplot parameters for a tight layout
        plt.show()

    except Exception as e:
        print(f"An error occurred during analysis: {e}")
        print("Please ensure the file is a valid WAV format and necessary libraries are installed.")

if __name__ == "__main__":
    # --- Instructions for Use ---
    print("-------------------------------------------------------------------")
    print("           WAV File Deep Analysis Script")
    print("-------------------------------------------------------------------")
    print("This script will help you analyze a WAV file for whistling artifacts.")
    print("It generates: 1) Waveform, 2) Spectrogram, and 3) Power Spectral Density (PSD).")
    print("\nTo use:")
    print("1. Make sure you have the required libraries installed:")
    print("   pip install numpy librosa matplotlib scipy")
    print("2. Replace 'your_audio_file.wav' below with the actual path to your file.")
    print("3. Run this script from your terminal: python audio_analyzer.py")
    print("-------------------------------------------------------------------")

    # --- IMPORTANT: Replace 'your_audio_file.wav' with the path to your file ---
    # Example: file_to_analyze = "C:/Users/YourUser/Documents/whistle_output.wav"
    # Example: file_to_analyze = "/home/user/audio_files/fastpitch_output.wav"
    # Example: file_to_analyze = "mixer_tts_whistle.wav" # if in the same directory

    file_to_analyze = "your_audio_file.wav" # <--- **REPLACE THIS LINE**

    analyze_wav_file(file_to_analyze)

    print("\nAnalysis complete. Examine the generated plots carefully.")
    print("If you see a whistle, it will typically appear as:")
    print(" - A very regular, high-frequency oscillation in the waveform.")
    print(" - A distinct, narrow horizontal line in the spectrogram (note its frequency).")
    print(" - A sharp, prominent peak in the Power Spectral Density (PSD) plot.")
    print("\nOnce you identify the frequency, you can investigate if it correlates with:")
    print(" - Specific model parameters (e.g., sampling rate issues).")
    print(" - Artifacts in the training data.")
    print(" - Vocoder limitations (try different vocoders if possible).")
