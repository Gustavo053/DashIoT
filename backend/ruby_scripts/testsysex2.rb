require 'rubygems'
require 'arduino_firmata'
require 'mqtt'

#pega os argumentos que o electron enviou por linha de comando
pinToRead, port, broker = ARGV

#conexão com o broker mqtt
mqtt_url = broker
client = MQTT::Client.connect(mqtt_url, client_id: 'Electron application')

#converte para inteiro
pinToRead = pinToRead.to_i

esp32 = ArduinoFirmata.connect port
#registro (listener)
esp32.on :sysex do |command, data|
    if command == 0x02
        puts "data : #{data.inspect}" #[x,0,y,0,z,0,.....] size: 2n
        #agrega bytes do dado em si - reconstrucao
        dataHwToFw = 0
        for i in 0..(data.size-1)
            if i % 2 == 0 then
                dataHwToFw += data[i]
            end
        end

        #publica os valores no broker
        client.publish('data', dataHwToFw)
        puts dataHwToFw # o que recebeu do HW (a leitura em si)
    end
end

dataFwToHw = []
# parte fixa (pin)
dataFwToHw.push(pinToRead)

print dataFwToHw

loop do
    esp32.sysex 0x02, dataFwToHw                             
    sleep 0.01
end
