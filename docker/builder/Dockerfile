FROM node:5.12.0

ENV NODE_ENV development
ENV BABEL_ENV production
ENV BUILD_ENV production

WORKDIR /src/

VOLUME /src
VOLUME /target

ADD build.sh /build.sh
RUN chmod +x /build.sh

CMD ["/build.sh"]
