FROM node:10-buster

USER node
WORKDIR /code

RUN touch $HOME/INITIAL

COPY docker/frontend/entrypoint.sh /
ENTRYPOINT [ "/entrypoint.sh" ]
