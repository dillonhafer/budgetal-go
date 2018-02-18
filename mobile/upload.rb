# Get credentials
user, passwd = File.readlines(".credentials").map(&:chomp)
abort("No username/password") if user.to_s == "" || passwd.to_s == ""

# Get IPA
path = File.join(Dir.home, "Downloads", "*.ipa")
files = Dir.glob(path).sort_by(&File.method(:ctime))
ipa = files.last
abort("Could not find IPA") if ipa.to_s == ""

puts "Validating file: #{ipa}"
if system("altool --validate-app -f #{ipa} -u #{user} -p '#{passwd}'")
  puts "Uploading file: #{ipa}"
  system(`altool --upload-app -f #{ipa} -u #{user} -p '#{passwd}'`)
end
