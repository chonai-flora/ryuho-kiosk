FROM python:3.9-alpine

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

WORKDIR /app/

COPY ./.env .env
COPY ./requirements.txt requirements.txt

RUN apk add --no-cache \
    postgresql-libs \
    postgresql \
    postgresql-contrib \
    postgresql-client \
    && apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev \
    && python3 -m pip install -r /app/requirements.txt --no-cache-dir \
    && apk --purge del .build-deps

COPY . /app/

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]