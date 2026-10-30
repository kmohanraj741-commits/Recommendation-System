pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "mohanraj741/recommendation-system"
        DOCKER_CREDENTIALS = "dockerhub-creds"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Detect Version") {
            steps {
                script {
                    if (env.BRANCH_NAME == "v1") {
                        env.VERSION = "v1"
                        env.HOST_PORT = "3001"
                    } else if (env.BRANCH_NAME == "v2") {
                        env.VERSION = "v2"
                        env.HOST_PORT = "3002"
                    } else if (env.BRANCH_NAME == "v3") {
                        env.VERSION = "v3"
                        env.HOST_PORT = "3003"
                    } else {
                        error("Unsupported branch: ${env.BRANCH_NAME}")
                    }

                    env.IMAGE_TAG = "${DOCKER_IMAGE}:${env.VERSION}"

                    echo "Version: ${env.VERSION}"
                    echo "Host Port: ${env.HOST_PORT}"
                    echo "Docker Image: ${env.IMAGE_TAG}"
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                powershell '''
                    docker build -t "$env:IMAGE_TAG" .
                '''
            }
        }

        stage("Test Docker Image") {
            steps {
                powershell '''
                    docker run --rm "$env:IMAGE_TAG" node --check server.js
                '''
            }
        }

        stage("Login to Docker Hub") {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "dockerhub-creds",
                        usernameVariable: "DOCKER_USERNAME",
                        passwordVariable: "DOCKER_PASSWORD"
                    )
                ]) {
                    powershell '''
                        $env:DOCKER_PASSWORD | docker login -u $env:DOCKER_USERNAME --password-stdin
                    '''
                }
            }
        }

        stage("Push Docker Image") {
            steps {
                powershell '''
                    docker push "$env:IMAGE_TAG"
                '''
            }
        }

        stage("Deploy Container") {
            steps {
                powershell '''
                    $containerName = "recommendation-$env:VERSION"

                    docker rm -f $containerName 2>$null

                    docker run -d `
                        --restart unless-stopped `
                        --name $containerName `
                        -p "$env:HOST_PORT`:3000" `
                        "$env:IMAGE_TAG"
                '''
            }
        }
    }

    post {
        success {
            echo "Recommendation System ${env.VERSION} deployed successfully on port ${env.HOST_PORT}"
        }

        failure {
            echo "Jenkins pipeline failed."
        }
    }
}