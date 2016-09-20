node() {
    def builder;
    def version = version()
    def commit = commitSha1()
    def commitMessage = commitMessage()
    slackSend channel: '#dev', color: '#6CBDEC', message: "*Starting * build job ${env.JOB_NAME} ${env.BUILD_NUMBER} from branch *${env.BRANCH_NAME}* (<${env.BUILD_URL}|Open>).\nCommit `${commit}` message :\n```${commitMessage}```"
    stage('Building docker tool image') {
        checkout scm
        dir('docker/builder/') {
            builder = docker.build('kodokojo/kodokojo-ui:builder')
        }
    }
    stage('Building kodokojo-ui') {
        checkout scm
        builder.inside(" -v ${pwd()}:/src -e \"KODOKOJO_UI_VERSION=${version}\" ") {

            built = sh returnStatus: true, script: 'mkdir -p /src/static && /build.sh'
            if (currentBuild.result != 'FAILURE' && built == 0) {
                slackSend channel: '#dev', color: 'good', message: "Building job ${env.JOB_NAME} in version $version from branch *${env.BRANCH_NAME}* on commit `${commit}` \n Job ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) *SUCCESS*."
            } else {
                slackSend channel: '#dev', color: 'danger', message: "Building job ${env.JOB_NAME} in version $version from branch *${env.BRANCH_NAME}* on commit `${commit}` \n Job ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) *FAILED*."
            }
        }
    }
}

def version() {
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
