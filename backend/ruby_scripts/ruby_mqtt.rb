require 'rubygems'
require 'mqtt'

# # Publish example
# MQTT::Client.connect('mqtt://rubyemqtttest:b2fb429381e6af84@broker.shiftr.io') do |c|
#   c.publish('test', 'message')
# end

# # Subscribe example
MQTT::Client.connect('mqtt://rubyemqtttest:b2fb429381e6af84@broker.shiftr.io', client_id: 'Gustavo') do |c|
  # If you pass a block to the get method, then it will loop
  c.get('ESP32') do |topic, message|
    puts "#{topic}: #{message}"
  end
end