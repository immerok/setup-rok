# `setup-rok`

This action installs the [`rok` CLI](https://docs.immerok.cloud/docs/tutorials/getting_started/#setting-up-the-rok-cli)
of [Immerok Cloud](https://www.immerok.io/) in your GitHub Actions workflow and allows you to log in.

| Runner OS | Supported          |
|-----------|--------------------|
| Linux     | :white_check_mark: |
| Windows   | :x:                |
| MacOS     | :x:                |

## Usage

```yaml
- name: Install rok CLI
  uses: immerok/setup-rok@v1
  with:
    # Required: the CLI version to use.
    version: 0.0.1
    # Optional: if provided, the CLI will be logged in using this token.
    # accessToken: 
```
