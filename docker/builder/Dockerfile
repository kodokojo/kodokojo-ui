FROM node:6.9.2

ENV NODE_ENV production
ENV BABEL_ENV production

WORKDIR /src/

VOLUME /src
VOLUME /target

# add jq to parse npm package version in build
RUN apt-get update
RUN apt-get install jq
ADD build.sh /build.sh
RUN chmod +x /build.sh
ADD test.sh /test.sh
RUN chmod +x /test.sh
ADD makeTar.sh /makeTar.sh
RUN chmod +x /makeTar.sh

CMD ["/build.sh"]
