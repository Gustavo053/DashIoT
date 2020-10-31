# #!/usr/bin/env ruby
$:.unshift File.expand_path '../../lib', File.dirname(__FILE__)
require 'rubygems'
require 'arduino_firmata'

esp32 = ArduinoFirmata.connect "/dev/ttyUSB0" 
puts "firmata version #{esp32.version}"

## regist event
esp32.on :sysex do |command, data|
  puts "command : #{command}"
  puts "data    : #{data.inspect}"
  
  sleep 2
end

## send sysex command
esp32.sysex 0x01, [13, 5, 2]  # pin13, blink 5 times, 200 msec interval
# esp32.sysex 0x01, [11, 3, 10]  # pin11, blink 3 times, 1000 msec interval

loop do
  sleep 1
end 