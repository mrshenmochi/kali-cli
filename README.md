# KaliCLI

KaliCLI is a powerful npm package designed to streamline and simplify command-line interactions within Kali Linux. With KaliCLI, users can execute system commands with ease and speed through intuitive console interfaces, enhancing productivity and efficiency in various tasks, including security testing, penetration testing, and system administration. Whether you're a seasoned cybersecurity professional or a beginner exploring the depths of Kali Linux, KaliCLI provides a seamless experience for executing commands, empowering users to focus on their objectives without the complexities of traditional command-line interfaces.

## Instalation

All commands are prefixed with "k-", so they should be executed like "k-update", for example.

```bash
npm i -g kali-cli
```

## Update

Simplify system updates with a single command. Executes `apt-get update` followed by `apt-get upgrade -y`.

```bash
k-update
```

## Fping

Discover networks and devices effortlessly. Executes the `fping` command for network and device discovery.

```bash
k-fping
```
