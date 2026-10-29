pipeline {
    agent any
    environment {
        IMAGE = 'YOUR_DOCKERHUB_USERNAME/recommendation-system:v1'
        // Update these paths to the actual docker.exe and kubectl.exe paths on your PC.
        DOCKER = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe'
        KUBECTL = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe'
    }
    stages {
        stage('Checkout Verification') {
            steps { bat 'git log -1 --oneline' }
        }
        stage('Validate Application') {
            steps { bat 'node --check server.js' }
        }
        stage('Docker Build') {
            steps { bat '"%DOCKER%" build -t %IMAGE% .' }
        }
        stage('DockerHub Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-recommendation',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_TOKEN')]) {
                    bat '''
                        @echo off
                        setlocal
                        set "DOCKER_CONFIG=%WORKSPACE%\\docker-auth"
                        if not exist "%DOCKER_CONFIG%" mkdir "%DOCKER_CONFIG%"
                        echo %DOCKER_TOKEN%| "%DOCKER%" login --username "%DOCKER_USER%" --password-stdin
                        if errorlevel 1 exit /b 1
                        "%DOCKER%" push "%IMAGE%"
                        if errorlevel 1 exit /b 1
                        "%DOCKER%" logout
                    '''
                }
            }
        }
        stage('Kubernetes Deploy') {
            steps {
                withCredentials([file(credentialsId: 'recommendation-kubeconfig', variable: 'KUBECONFIG')]) {
                    bat '''
                        @echo off
                        "%KUBECTL%" apply -f k8s/v1.yaml
                        if errorlevel 1 exit /b 1
                        "%KUBECTL%" rollout status deployment/recommendation-v1 --timeout=120s
                        if errorlevel 1 exit /b 1
                        "%KUBECTL%" get deployment recommendation-v1
                    '''
                }
            }
        }
    }
    post {
        always {
            bat '''
                @echo off
                if exist "%WORKSPACE%\\docker-auth" rmdir /s /q "%WORKSPACE%\\docker-auth"
            '''
        }
    }
}
