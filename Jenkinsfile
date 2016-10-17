node() {
    def builder
    stage('Building docker tool image') {
        checkout scm
        def commit = commitSha1()
        def commitMessage = commitMessage()
        slackSend channel: '#dev', color: '#6CBDEC', message: "*Starting * build job ${env.JOB_NAME} ${env.BUILD_NUMBER} from branch *${env.BRANCH_NAME}* (<${env.BUILD_URL}|Open>).\nCommit `${commit}` message :\n```${commitMessage}```"
        try {
            dir('docker/builder/') {
                builder = docker.build('kodokojo/kodokojo-ui:builder')
            }
        } catch (Exception e) {
            slackSend channel: '#dev', color: 'danger', message: "Building job ${env.JOB_NAME} in version $version from branch *${env.BRANCH_NAME}* on commit `${commit}` \n Job ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) *FAILED*.\n"
        }
    }
    stage('Building kodokojo-ui') {
        checkout scm
        def version = versionJs()
        def commit = commitSha1()
        def c = builder.inside(" -v ${pwd()}:/src -e \"KODOKOJO_UI_VERSION=${version}\" ") {

            built = sh returnStatus: true, script: 'mkdir -p /src/static && /build.sh'

            sh 'cp -R /target/* docker/delivery/'
            sh 'ls -l docker/delivery/'
            if (currentBuild.result != 'FAILURE' && built == 0) {
                slackSend channel: '#dev', color: 'good', message: "Building job ${env.JOB_NAME} in version $version from branch *${env.BRANCH_NAME}* on commit `${commit}` \n Job ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) *SUCCESS*."
            } else {
                slackSend channel: '#dev', color: 'danger', message: "Building job ${env.JOB_NAME} in version $version from branch *${env.BRANCH_NAME}* on commit `${commit}` \n Job ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) *FAILED*."
            }
        }
    }
    buildAndPushDocker()
}

def versionJs() {
    def matcher = readFile('package.json') =~ '"version": "(.*)",'
    matcher ? matcher[0][1] : null
}

def commitSha1() {
    sh 'git rev-parse HEAD > commit'
    def commit = readFile('commit').trim()
    sh 'rm commit'
    commit.substring(0,7)
}

def commitMessage() {
    sh 'git log --format=%B -n 1 HEAD > commitMessage'
    def commitMessage = readFile('commitMessage')
    sh 'rm commitMessage'
    commitMessage
}

def buildAndPushDocker() {
    stage('Building docker image then Push it') {
        def version = versionJs()
        def commit = commitSha1()
        def imageName = "kodokojo/kodokojo-ui:latest"
        try {
            sh 'docker/delivery'
            sh "mkdir -p docker/delivery/static && tar zxvf docker/delivery/kodokojo-ui-${version}.tar.gz -C docker/delivery/static"
            sh "docker build --no-cache -t=\"${imageName}\" ${pwd()}/docker/delivery/ && docker push ${imageName}"

            slackSend channel: '#dev', color: '#6CBDEC', message: "Build and push Docker image *${imageName}* from branch *${env.BRANCH_NAME}* on commit `${commit}` *SUCCESS*."
        } catch (Exception e) {
            slackSend channel: '#dev', color: 'danger', message: "Build and push Docker image *${imageName}* from branch *${env.BRANCH_NAME}* on commit `${commit}` *FAILED*:\n```${e.getMessage()}```"
        }
    }
}
