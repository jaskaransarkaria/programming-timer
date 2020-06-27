# Pair Programming Timer - Client

[![Build Status](https://travis-ci.com/jaskaransarkaria/programming-timer.svg?branch=master)](https://travis-ci.com/jaskaransarkaria/programming-timer)

[https://www.pairprogrammingtimer.com](https://www.pairprogrammingtimer.com)

---

## tl;dr

Keep time and turn order when you are pair programming, you can find the server code [here](https://github.com/jaskaransarkaria/programming-timer-server).


## Git and Deployment

1) Branch from `master`
2) Make your changes
3) Ensure you pass all the tests prompted by Husky's git hooks
4) Merge back into `master`
5) *Deploy* by tagging a release on github

## Stack

  * `Svelte` - A component framework which runs at build time with no virtual DOM. Svelte converts components into highly efficient imperative code that surgically updates the DOM [more details](https://svelte.dev/).
  * `Kubernetes` - An open-source system for automating deployment, scaling, and management of containerized applications.
  * `Docker` - Docker is a software platform that allows you to build, test, and deploy applications. Docker packages software into standardized units called containers that have everything the software needs to run.
  * `Rollup` - module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.
  * `Jest` - JavaScript Testing Framework with a focus on simplicity.
  * `Eslint` - static code analysis tool for identifying problematic patterns found in JavaScript code.
  * `Husky` - git hooks.
  * `scripts/` - build and deploy bash scripts.

## Getting Started

Install `kubectl` from [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

Set up credentials to a kubernetes cluster.

Install the dependencies and run locally...

  * `npm install`

  * `npm run dev`

> **NOTE**  - By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

*Environment varibales such as the `SERVER_ADDR` can be found in `rollup.config.js`

## Useful Commands

* `npm run build` - Compile the code
* `npm run lint` - Run linter
* `npm run test` - Run all tests
* `npm run test:watch` - Run tests continuously
* `scripts/deploy.sh $VERSION_NUMBER` - Deploys any changes to kubernetes` manifests, builds a new docker image, pushes it to docker hub and finally scales the deployment to pull the newly created image.
* `scripts/deploy_kubernetes_config.sh` - Deploys just kubernetes manifest changes (kubernetes secret is excluded from the script).
* `scripts/push_docker.sh $VERSION_NUMBER` - Builds and pushes the code to dockerhub with a $VERSION_NUMBER as a tag.

## Deployment

To deploy to production tag a release on master branch

Manual deployment is driven by bash scripts found in `scripts/`. _You must currently cd into scripts/ to execute them_.

To deploy your changes manually run (see "Useful Commands" for details):

  `./scripts/deploy.sh $VERSION_NUMBER`

 > **NOTE** - If you change the VERSION_NUMBER of the docker image you must manually change the associated tag in `.kubernetes/deployment.yaml`. Use `scripts/deploy_kubernetes_config.sh` for updating just  k8 config.

### Todos

- [x] Https
- [x] Travis CI/ CD & git branch rules/protection
- [x] Graphical representation of timer using SVG
- [x] Add tests for the SVG
- [x] Add notifications when timer finishes and prompt to restart the timer

- [ ] Add notification sound
- [ ] Set up re-direct from `pairprogrammingtimer.com` -> `www.pairprogrammingtimer.com` (redirect is currently blocked by browsers as it is not https - before testing https changes _remember_ to switch to `letencrypt-staging`)
- [ ] Tidy up bash scripts so can be called from proj root, prompt for required arguments and set VERSION_NUMBER so it is consistent across docker and k8 manifest.
- [ ] Set up proper environment configs
