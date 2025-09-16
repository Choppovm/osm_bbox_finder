import json
import sqlite3 # written for SQLite databases only, main tool i use is DBBrowser.

# file paths
jsonPath = "(relative) file path goes here"
dbPath = "(relative) file path goes here"

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
    swLat REAL,
    swLon REAL,
    neLat REAL,
    neLon REAL
)
""")

# Insert ddata
for isoA3Code, coords in data.items():
    swLat = coords["sw"]["lat"]
    swLon = coords["sw"]["lon"]
    neLat = coords["ne"]["lat"]
    neLon = coords["ne"]["lon"]

    cursor.execute("""
        INSERT OR REPLACE INTO countries (countryCode, swLat, swLon, neLat, neLon)
        VALUES (?, ?, ?, ?, ?)
    """, (isoA3Code, swLat, swLon, neLat, neLon))

# Commit and close
conn.commit()
conn.close()

print("done")
