import json
import sqlite3 # written for SQLite databases only, main tool i use is DBBrowser.

# file paths
jsonPath = "countryBoundingBoxes.json"
dbPath = "boundingBoxes.db"

# joad json data
with open(jsonPath, "r", encoding="utf-8") as f:
    data = json.load(f)

# connect to SQLite
conn = sqlite3.connect(dbPath)
cursor = conn.cursor()

# (failsafe) create "countries" table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS countries (
    countryCode TEXT PRIMARY KEY,
    countryFullName TEXT,
    swLat REAL,
    swLon REAL,
    neLat REAL,
    neLon REAL
)
""")

# Insert data
for isoA3Code, coords in data.items():
    countryFullName = coords["fullName"]
    swLat = coords["sw"]["lat"]
    swLon = coords["sw"]["lon"]
    neLat = coords["ne"]["lat"]
    neLon = coords["ne"]["lon"]

    cursor.execute("""
        INSERT OR REPLACE INTO countries (countryCode, countryFullName, swLat, swLon, neLat, neLon)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (isoA3Code, countryFullName, swLat, swLon, neLat, neLon))

# Commit and close
conn.commit()
conn.close()

print("done")
