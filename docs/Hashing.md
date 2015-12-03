# Hashing

## Images

You need to create and update hashes for image filenames. This is so caching doesn't serve up older images after we change them.

### Install

```
$> sudo npm install -g hasha-cli
```

### Usage

Create an image hash.
```
$> hasha <image> --algorithm=md5
```
Update your image filename with that hash. Example:
```
image-name.<hash>.png
```
