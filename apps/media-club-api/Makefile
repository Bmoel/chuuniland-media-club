.PHONY: db seed start sync-to-snapshot dev favorites-sync-job invoke-favorites-sync query

# Start DynamoDB Local
db:
	docker run -d -p 8000:8000 amazon/dynamodb-local

# Seed tables: defaults to all tables, or pass TABLES="t1 t2" to seed specific ones
seed:
	cargo run --bin seed_local_db $(if $(TABLES),-- $(TABLES),)

# Start everything: db → seed all tables → dev
start:
	$(MAKE) db
	$(MAKE) seed
	$(MAKE) dev

sync-to-snapshot:
	aws dynamodb scan --table-name $(TABLE) --endpoint-url http://localhost:8000 > ./snapshots/$(FILE).json

# Run the local API
dev:
	cargo lambda watch

# Run the favorites sync job locally (keep running to accept invocations)
favorites-sync-job:
	cargo lambda watch --bin favorites_job

# Invoke the favorites sync job (requires favorites-sync-job to be running)
invoke-favorites-sync:
	cargo lambda invoke favorites_job --data-ascii '{}'

# Query the lambda api
query:
	curl http://localhost:9000/lambda-url/media-club-api/$(URL)
