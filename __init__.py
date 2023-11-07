import os
import glob
import qrcode
import logging

# Setup logging
logging.basicConfig(filename='debug.log', level=logging.DEBUG, format='%(asctime)s - %(message)s')

# Set path to the root directory
root_dir = 'sources/'

# Iterate over all subdirectories in the root directory
for subdir, dirs, files in os.walk(root_dir):
    if subdir == root_dir: continue
    logging.debug(f"Checking directory: {subdir}")
    # Find the first .json file in the subdirectory
    json_files = [f for f in files if f.endswith('.json')]
    if json_files:
        first_json_file = json_files[0]
        logging.debug(f"First JSON file in {subdir}: {first_json_file}")

        # Generate the URL
        url = f'https://github.com/Bluscream/GrayJay/raw/master/{subdir}/{first_json_file}'
        logging.debug(f"Generated URL: {url}")

        # Generate the QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill='black', back_color='white')

        # Save the QR code as <subfolder>/qr.png
        img.save(f'{subdir}/qr.png')
        logging.debug(f"QR code saved at: {subdir}/qr.png")
    else:
        logging.debug(f"No JSON files in {subdir}")
