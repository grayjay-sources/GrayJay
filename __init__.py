import os
import glob
import qrcode
import logging
from pathlib import Path
from json import load as json_load
from urllib import request #, _UrlopenRet
from urllib.parse import ParseResult, urlparse, urlunparse
from typing import Any, Optional
from pprint import pformat

# Setup logging
logging.basicConfig(filename='debug.log', level=logging.DEBUG, format='%(asctime)s - %(message)s')

# Set path to the root directory
root_dir = 'sources/'

def make_request(url):
    req = request.Request(url,  data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    })
    return request.urlopen(req)

def download_file(url, save_path):
    print(f"Downloading {url} to {save_path}")
    try:
        # response: _UrlopenRet
        with make_request(url) as response:
            file_content = response.read()
            if response.status != 200:
                raise Exception(f"Failed to download file. Status code: {response.status}")
            with open(save_path, 'wb') as file:
                file.write(file_content)
        print(f"File downloaded successfully to {save_path}")
    except Exception as e:
        print(f"Failed to download file. Error: {e}")

def get_parent_url(url: ParseResult):
    return url.path.rsplit('/', 1)[0] # [:-1]

def parse_url(url: str, content: dict[str,Any]):
    return parse_repo(url, content)

def parse_repo(url: ParseResult, content: dict[str,Any]):
    domain = url.netloc.lower()
    ret = domain
    match(domain):
        case "github.com":
            repo = parse_github_repo(url)
            ret = f"https://github.com/{repo[0]}/{repo[1]}/raw/"
            if repo[2]: ret+=f"{repo[2]}/"
        case "plugins.grayjay.app"|"grayjay.app"|"futo.org": ret = content.get("baseUrl") or get_parent_url(urlparse(content["sourceUrl"]))
    return ret + "/" if not ret.endswith("/") else ret

def parse_github_repo(parsed_url: ParseResult):
    path_components = parsed_url.path.split('/')
    if len(path_components) < 3: raise ValueError(f"The github URL '{parsed_url}' does not contain a user and repository name.")
    user = path_components[1]
    repo = path_components[2]
    branch = None
    if len(path_components) > 3:
        if len(path_components) > 4 and path_components[3] in ["tree","blob"]:
            branch = path_components[4]
        else: branch = path_components[3]
    return user, repo, branch

def is_relative_url(url: str):
    return url.startswith('./')

def fix_url(url: str):
    if is_relative_url(): return str(url[1:])

def try_urls(urls: list[ParseResult]):
    for url in urls:
        url = urlunparse(url)
        print(f"Trying url {url}")
        try:
            with make_request(url) as response:
                if response.status != 200: continue
                return url, response
        except Exception as e:
            print(f"Failed to request {url}. Error: {e}")

def find_urls(content: dict[str,Any]) -> list[ParseResult]:
    ret = set()
    for prop in ["repositoryUrl","sourceUrl","scriptUrl","baseUrl"]:
        url = content.get(prop)
        if url and not is_relative_url(url):
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.lower()
            path_components = parsed_url.path.split('/')
            if "." in path_components[-1]:
                print("possible file url", url)
            repo_url = parse_repo(parsed_url, content)
            if repo_url: print("got repo url:",repo_url)
            ret.add(parsed_url)
    return ret

def updateSource(path: Path, js_files: list[Path]):
    with path.open(encoding="UTF-8") as source:
        content = json_load(source)

    repo_url = content.get("repositoryUrl")
    json_url = content.get("sourceUrl")
    if not json_url: raise ValueError(f"sourceUrl missing from {path}")
    # possible_urls = find_urls(content)
    # print(f"possible_urls: {pformat(possible_urls)}")
    # url, response = try_urls(possible_urls) or None, None
    # print(f"tried_urls: {pformat([url, response])}")
    script_url = content.get('scriptUrl')
    if not script_url: raise ValueError(f"scriptUrl missing from {path}")
    # if script_url.startswith('./'): script_url = base_url +'/'.join(script_url[2:])
    # if repo_url: parsed_repo_url = parse_repo(repo_url, content)
    # print(parsed_repo_url)
    download_file(json_url, path)
    # print(json_url)
    # parsed_source_url = json_url.rsplit('/', 1)
    # new_url = f"https://{parsed_source_url}/{script_url}"
    # print(new_url)

# Iterate over all subdirectories in the root directory
for subdir, dirs, files in os.walk(root_dir):
    if subdir == root_dir: continue
    subdir = Path(subdir)
    logging.debug(f"Checking directory: {subdir}")
    # Find the first .json file in the subdirectory
    json_files = [Path(subdir/f) for f in files if f.lower().endswith('.json')]
    js_files = [Path(subdir/f) for f in files if f.lower().endswith('.js')]
    if json_files:
        first_json_file = json_files[0]
        logging.debug(f"Found {len(json_files)} JSON files in {subdir}: {first_json_file}")

        # Generate the URL
        url = f'https://github.com/Bluscream/GrayJay/raw/master/{subdir}/{first_json_file.name}'

        updateSource(first_json_file, js_files)
        
        logging.debug(f"Generated URL: {url}")

        continue

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
