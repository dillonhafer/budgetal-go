require 'json'

# Load file
file = File.join(File.dirname(__FILE__), 'app.json')
app = JSON.load(File.open(file))

# Compute new version
v = app["expo"]["version"].split(".").map(&:to_i)
v[1] += 1
new_version = v.join(".")
new_build_number = app["expo"]["android"]["versionCode"] + 1

# Bump versions
app["expo"]["android"]["versionCode"] = new_build_number
app["expo"]["ios"]["buildNumber"] = new_build_number.to_s
app["expo"]["version"] = new_version

# Save file
File.write(file, JSON.pretty_generate(app))