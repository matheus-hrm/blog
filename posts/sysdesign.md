
# Teorema CAP

> *esse teorema diz que não podemos ter essas três características em um sistema*

- **Consistency** - Consistência
- **Availability** - Disponibilidade
- **Partition tolerance** - Tolerância a Partições
## Consistência

- Todos os nodes do sistema veem os mesmos dados ao mesmo tempo
## Disponibilidade

- Cada solicitação recebe uma resposta (sucesso ou falha) mesmo que o sistema esteja indisponível
## Tolerância a partição

- O sistema continua funcionando mesmo com falhas em partes do sistema.
## Possibilidades

- **CP (Consistência e Tolerância à Partição)**: Garante consistência e funcionamento em caso de partições, mas pode sacrificar a disponibilidade.
    - Exemplo: **MongoDB** em modo de consistência forte.
- **AP (Disponibilidade e Tolerância à Partição)**: Garante disponibilidade e tolerância à partição, mas pode haver inconsistências temporárias nos dados.
    - Exemplo: **Cassandra**, **DynamoDB**.

---

#

# Escalonamento

- Escalonamento horizontal -> aumentando o **número de réplicas**.
- Escalonamento vertical ->  aumentando sua **performance**. ex:(RAM, CPU,...)
# Load balancer

Recebe as requisições do usuário e serve como intermediador entre os servidores.

- Distribui a carga igualmente entre os vários servers, evitando overload.
### Features

- **Health Check**: O LB sabe o estado de atividade de cada servidor. (online, offline)
- **TLS termination**: Descriptografia das chamadas retirando a responsabilidade do back-end.
- **Service Discovery**: Sabe para onde encaminhar as chamadas caso um dos servidores caia.
# Database Replication

A replicação é responsável por eliminar problemas como o single point of failure.
### **Replicação Síncrona**

Quando um usuário envia uma query de escrita para o DB, é necessário que ele aguarde todo o processo de replicação entre as diversas instâncias.
- Maior Consistência, Menor performance (Alta latência)
### **Replicação Assíncrona**

O processo de replicação é feito em segundo plano. Essa alternativa possui maior performance e tempo de resposta, porém não garante consistência.
### Single Leader Replication

- Separação em um DB mestre que recebe `writes` e servos que são responsáveis por `reads` .
- Os servos recebem periodicamente replicações baseadas no DB mestre.
- Sem Conflitos, baixo throughput, single point of failure
### Multi Leader Replication

- Caso o mestre caia um dos servos assume seu lugar.
- Possibilidade de conflitos, alto throughput.
# Cache

- Se o dado existe no cache, le diretamente do cache
- Se o dado não existe, é salvo no cache
# CDN

- Serve arquivos estáticos rapidamente.
- Funciona da mesma forma que o cache.
- Pode ser localizado mais perto do usuário para menor latencia.
# Database Sharding/Partitioning

#### *Performance, Disponibilidade* 

Nessa arquitetura dividimos o conteúdo do nosso banco de dados em varias instancias, utilizamos uma sharding key para identificar a qual instancia o conteúdo pertencerá. Cada particao contem um subconjunto dos dados

## Range-Based Sharding

- Dados são divididos em um intervalo de valores.
- Salvar id's em um shard de acordo com seu intervalo. 
- Pode causar desbalanceamento de carga.
ex:(0-100 -> Shard 1; 100-200 -> Shard 2)
## Hash-Based Sharding

- Por exemplo, utilizando um `user_id` do tipo Integer como sharding key, podemos pegar o resto da divisão do id pelo número `n` de instâncias do banco de dados.
- Distribui uniformemente, dificulta consultas em intervalos e redistribuição ao escalonar horizontalmente os shards.