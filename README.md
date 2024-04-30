# ryuho-kiosk
無人売店システムです。

## 0. 環境変数を設定する
`**/.env.sample` を参照し、`.env`、`frontend/.env`、`backend/.env` に作成し、それぞれの環境変数を設定する。

## 1. コンテナを起動する
```bash
docker-compose -f docker-compose.yml up -d
```

## 2. マイグレーションファイルを自動生成する
コンテナ内に移動し、マイグレーションを行う。

```bash
docker-compose exec backend sh
```

```bash
alembic revision --autogenerate -m ""
```

## 3. マイグレーションファイルの内容をデータベースに反映する
```bash
alembic upgrade head
exit
```