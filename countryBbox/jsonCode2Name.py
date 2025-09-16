import json

# Load the country names
with open("(relative) file path here", "r", encoding="utf-8") as f:
    countryNames = json.load(f)

# Load the bounding box data
with open("(relative) file path here", "r", encoding="utf-8") as f:
    countryBounds = json.load(f)

# Merge the full name into each country entry
for code, bounds in countryBounds.items():
    completeName = countryNames.get(code)
    if completeName:
        bounds["fullName"] = completeName
    else:
        print(f"Warning: No name found for country code '{code}'")

# Save the merged result
with open("mergedCountries.json", "w", encoding="utf-8") as f:
    json.dump(countryBounds, f, indent=2, ensure_ascii=False)

print("Merge complete. Output saved to merged_countries.json")