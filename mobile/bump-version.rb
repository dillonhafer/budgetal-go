require 'json'

# Load file
file = File.join(File.dirname(__FILE__), 'app.json')
app = JSON.load(File.open(file))

# Bump versions
app["expo"]["android"]["versionCode"] += 1
new_version = app["expo"]["version"].split(".").map(&:to_i)
new_version[1] += 1
app["expo"]["version"] = new_version.map(&:to_s).join(".")

# Save file
File.write(file, JSON.pretty_generate(app))