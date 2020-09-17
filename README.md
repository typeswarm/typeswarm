# TypeSwarm

Docker Swarm configuration generator.

![](typeswarm-logo.svg)

## Features

### Dynamic generation of Docker Swarm configuration

Generate your Docker Swarm configuration dynamically.

### Design-time and compile-time type checking

TypeSwarm uses TypeScript along with interfaces based on [Compose Specification](https://github.com/compose-spec/compose-spec), that allows to develop easier in any IDE supporting TypeScript.

### Configs and secrets rotation

In Docker Swarm configs and secrets are immutable. Meaning after you have deployed a config `my-config-name`, then you change its content and deploy it again, it will not change on the server. The only way to change the content of previously deployed config or secret is to change its name, then change all the references across your configuration, then deploy it

TypeSwarm allows to automate this process, because it generates configs and secrets names dynamically, based on the content hash. It also updates all references automatically.

### Configs and secrets generation

In Docker Swarm it is only possible to generate configs and secrets from files.

With TypeSwarm there is a new property allowed for configs and secrets - `data`. You can pass an arbitrary string and it will be the source of the config or secret.

### Packages

Developers can create reusable packages of configurations and publish them in NPM. TypeSwarm is similar to Helm for Kubernetes, but instead of YAML it uses TypeScript, which makes the development process fun and easy.
