This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Published images versions
Published images are stored in the [veloxswiss/ui](https://hub.docker.com/r/veloxswiss/ui) docker hub repository.

|Version      | Description                                                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.1.0       | Create model from swagger file (Typescript)                                                                                                          |
| 2.0.1       | Fix the buttons in the ui                                                                                                                            |
| 2.0.0       | BREAKING CHANGE: Adjust PLP, PDP, Cart Page and Checkout Page to process Articles from new Catalog model                                             |
| 1.4.2       | Fix the layout of the Recommendation on the PLP                                                                                                      |
| 1.4.1       | Fix payment and shipment radio buttons on the Checkout Page                                                                                          |
| 1.4.0       | Add product variants on PLP & PDP                                                                                                                    |
| 1.3.9       | Fix currency change on PDP                                                                                                                           |    
| 1.3.8       | Add zoom in & zoom out function on the PDP                                                                                                           |
| 1.3.7       | Fix unnecessary whitespace on Direct Upload Page                                                                                                     |    
| 1.3.6       | Add Messages on Products on Cart Page                                                                                                                |    
| 1.3.5       | Add Mobile PLP                                                                                                                                       |    
| 1.3.4       | Fix scrolling on PDP and on Order Upload                                                                                                             |
| 1.3.3       | Dynamic page title on PDP                                                                                                                            |
| 1.3.2       | Adapt naming of packages and components                                                                                                              |
| 1.3.1       | Change default categoryId for trackings                                                                                                              |
| 1.3.0       | Add i18n                                                                                                                                             |
| 1.2.2       | Add using Price-Orchestration Service                                                                                                                |
| 1.2.1       | Add Checkout page                                                                                                                                    |
| 1.2.0       | Add ui for recommendation                                                                                                                            |
| 1.1.1       | Add using User-Orchestration Service                                                                                                                 |
| 1.1.0       | Digital order upload is using Sly Connect                                                                                                            |
| 1.0.0 (1.0) | Base ui image deployed to demo shop                                                                                                                  |

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Access the service
Cart service: [http://localhost:3000/cart](http://localhost:3000/cart).

Product list: [http://localhost:3000/product](http://localhost:3000/product).

Checkout page: [http://localhost:3000/checkout](http://localhost:3000/checkout).

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Environment variables

The environment variables should be added to the .env file and the docker-compose.yml file.

The env.sh script reads value of variable if exists as Environment variable in docker-compose.yml file, otherwise it use value from .env file.

The created env variables are stored in the env-config.ts file.

When run locally npm start executes the env.sh script and creates the env-config.ts file. When run with the docker, both env.sh and .env file are copied in the image and env.sh script is executed when
the nginx in the container is started.    

## Running in Docker

### Production build test run
To test App production build in simple Nginx container invoke:
```
docker build -t velox-ui . && docker run --rm --name velox-ui -p 3000:3000 velox-ui
```
This will create and start Nginx container mapped to local port 3000 serving optimized production build.

### Development inside Docker
To run app in dynamic development mode (as with `npm start`) inside Docker invoke:
```
docker run -it --rm -v `pwd`:/app -p 3000:3000 node /bin/bash -c "cd /app && npm install && npm start"
```
This will create Node container mapped to local port 3000 running App in development mode.