/* eslint-disable quotes */
/* eslint-disable max-len */

exports.controller = function(req, res, next) {
  const firstUser = {
    "identifier": `${req.id}`,
    "entityIdentifier": "15c850471f3add8a0dd937fda85ef0fe27519481",
    "firstName": "jpthiery",
    "lastName": "jpthiery",
    "name": "jpthiery jpthiery",
    "username": "jpthiery",
    "email": "jpthiery@xebia.fr",
    "password": "h8kiu45qb8iq4p820iqs4q54is",
    "privateKey":"-----BEGIN RSA PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCIiTddCskXUNi7\nRCcgnZGGcfqskOmLeL2pQc7W9wXrsbBDJz74J78LKWT+HvMVj+A8fKEVzh3Ftc6I\nlQFyQClXXnuhFY+nyoy9HDKxAw1SyesqE21Sb++ih7mOFU7UMGv2UCfKxVvOPFxR\n2Okjyar6CES9jG6u6quorwaBu9mUty0vej61PAQL65Txd8BTaGlKCTNEXLSFmvnp\npBIRvNBCRxgzJnRDly/afedmw+5KGXTxXZMSexGa9oe9fszCzvg0y8o17HUs/sW4\nOcZUeKHHplVTR+urZx7rSL6KjJ/hAH9TXlAx6JcIwrdHrVxz2SRTpLPWZQm5qzlb\n5OOqvFr1AgMBAAECggEAVCkorDxyueGGxt/6slsOEe5+ExL8MpGJbyR2aAE6cA9G\nVA6D/Rka5LluXEodksPt97rm3HcB2RX5Ki2XB6LPGODPmfqdY1MyL3uLL5tvAgIe\n5/+zmmYPM4Mv+Inf3mG+msTL0myW62g/i+AFzZ6IuriQDrramw1iJIdGnn95XfYe\nnT7Yk4I6JmaAu+DpbEGIZV2WoNXJnXK2EXFXzxkaMmdKjbsE0SBQCLUDaVZmn9bx\nBF51LL3a2aYTvFpb0ER6dWWSWIc9FLVzz10dEDDWvJoU6Z+SwS6/UUv/EJpp+DFy\nZDAajzYqZy6KficP8RoCEnPGHQAPgAo+siETK6qj3QKBgQD78/FQ0awQubWKOEH4\nOyz5sSUgtz17ZYDw3t3sX70o3tvEQxKZdWwCdqlI88eKYcCn3DcKAmJmhtJlVjRX\nKYkQQ43csDXfOHXen5MvU9svWVvZOIW7XAraZRsBeWLvhsCIdN+usE+YNAJ3s6SH\n4UJehmIjPnZTKkIM8vcMBn63pwKBgQCKuqq9JEPwZu+FkNnvoXtAtar0yH98vAYq\nTFkG7QXjQHRQbUns/e47e8p0Fvjq8yRHtCBfTnJqvCAlWpWY7JKMd5AfJ2T3YdcR\nTxSjJhFkIAxB60piI+QbTq0jLEn5CQfosGH7gPjVerA672L83OXtpyZPd+9x72AO\nWcJuaMSsAwKBgQCji9TP/lpvvOyfnScNZ/Qo3JlaJDfvmpLZSAHMRtU163vCaTtw\ni60h6D640S1soUl6bNL5V1Tico+uIgf1sEt9WCyE3YkKrc6tRO44oXk8wgeB+FOu\nq++LlmeyTEYxb0oZCayM63uvM8uKQf0CCvGXBCo98HTERUD8wNYmYyzsLwKBgQCC\npJlnd0B3oyhLOwbRcNvWK36r+Ch+ub6AlNd9+zYBNVCT8OeeQ9/WqpQUURHmiESR\nNeMKfaCoPTN0meKpWZgEqg/SFtIxWTUkurkvjwjvpnKEnWS2GSCWSrgnmGytFkEZ\ncwlCxMkQmPJe/dLVV907uZ4NVl/qhseJnCPKv+T+KwKBgQDLVeG47p69g5nLBR2K\nyO8CUXInsucTtjEx3d1GeHoooC/UjOLo8+aZ2DdGgRSbfjnPZQ7dNG8uZRDAiHjv\nW9ul87GGI4lGqbpzlVsSk8h5STeKWXcIbrnEOPBt6iRBSFT/7VdQIBQstJ/3qm05\nn57rpPmkEe4QCTx6MtLxzjRLPg\u003d\u003d\n-----END RSA PRIVATE KEY-----\n",
    "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDYji20blJoetQ7BLDEeRzmf3i49fQDCGSWrTF/i8ANiJufVOs7Q8Ce4+JXuTmQD4Kol7LaKmc7ObhZN8w7PrAd2HM8PqQQaVIww+hlmTXJDWpSMwl5+RyT/wWzO8n+F+F3ZiAL+IqqkAn3G5Q4Aw7lN65geceD57yrMJ9C3xedafHDHEQIuD34ACCbhp53ZXFpBMryDrRmMiYhUloxN0iYcgeYzG3AxXEYLaxp4hr74rEeJ1CRYArE/Z8cT3iyQ4/+oAZHfWq9Mc8ZKHMLz3lK3IkhDNE2Y4eFE/n1YEaw0h/uwCfo0mR6LX8pt7mJmHEjbdf8rHVXH4N4BZ7szMfp jpthiery@xebia.fr",
    "projectConfigurationIds": [
      {
        "projectConfigurationId": "1e25e0ca2fc382f332be16f1342d152eacedb434",
        "projectId": "b1392a68c1ea01d1e445f9464351f67af86c5e14"
      }
    ]
  }

  res.contentType = 'application/json'
  res.send(200, firstUser)
  next()
}