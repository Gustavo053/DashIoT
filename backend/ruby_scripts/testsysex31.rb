require 'rubygems'
require 'arduino_firmata'
require 'mqtt'
#path C:\Ruby27-x64\lib\ruby\gems\2.7.0\gems\arduino_firmata-0.3.7

#recebe a porta, o pino de leitura e escrita através do ARGV.
readPin, writePin, portUSB, broker = ARGV

readPin = readPin.to_i #Converte a string para inteiro
writePin = writePin.to_i #Converte a string para inteiro

#conexão com o broker mqtt
mqtt_url = broker
client = MQTT::Client.connect(mqtt_url, client_id: 'Electron application')

dataWrite = []
state = 0

dataWrite.push(writePin)
dataWrite.push(state)

esp32 = ArduinoFirmata.connect portUSB

#registro (listener)
esp32.on :sysex do |command, data|
    if command == 0x03
        puts "data : #{data.inspect}"
        state = data[0] 

        dataWrite = []

        dataWrite.push(writePin)
        dataWrite.push(state)

        #publica os valores no broker
        client.publish('data', state)
    end
end

loop do
   esp32.sysex 0x03, [readPin]
   sleep 0.01
   esp32.sysex 0x01, dataWrite
   sleep 0.01
end
