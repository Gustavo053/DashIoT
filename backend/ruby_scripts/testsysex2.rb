require 'rubygems'
require 'arduino_firmata'
require 'firebase'
require 'mqtt'

#pega os argumentos que o electron enviou por linha de comando
pinToRead, port, database, broker = ARGV

#conexão com o banco de dados
firebase_url = 'https://testesp32-d34c1.firebaseio.com/'
firebase = Firebase::Client.new(firebase_url)

# response = firebase.push('analogRead', {
#     :data => 'null'
# })

#conexão com o broker mqtt
mqtt_url = 'mqtt://77d7a1cb:b954dcddc878e4d7@broker.shiftr.io'
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

        # firebase.update('analogRead', {
        #     :data => dataHwToFw
        # })

        # client.publish('data', dataHwToFw)
        puts dataHwToFw # o que recebeu do HW (a leitura em si)
    end
end

dataFwToHw = []
# parte fixa (pin)
dataFwToHw.push(pinToRead)

print dataFwToHw

# i = 0
loop do
    # firebase.update('analogRead', {
    #     :data => i
    # })
    # i = i + 1
    # puts 'updated'

    esp32.sysex 0x02, dataFwToHw                             
    sleep 0.01
end
