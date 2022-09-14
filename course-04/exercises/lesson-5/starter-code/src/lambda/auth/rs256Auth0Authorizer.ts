
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken';
import * as middy from 'middy'
import 'source-map-support/register'
import { JwtToken } from '../../auth/JwtToken';

const certificate = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJdTN15FQ36kZ1MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1zMW83YTA1dy51cy5hdXRoMC5jb20wHhcNMjIwOTE0MDIyMTM4WhcN
MzYwNTIzMDIyMTM4WjAkMSIwIAYDVQQDExlkZXYtczFvN2EwNXcudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmZMDpvIfiiFSJK+b
/jAxjQFUK2l4Xva3eaT8G3AcFbWmK+xDTbIQTGnTkouEyWRc6GycKpN63Agadeoy
HRxKGNEUcgbTyttU4dffV0Umz85ZGrvUAQff2Gv0fCbwUjm2pFJmJSpfT6jCgSer
VfwPQAdWTOpgr4p0bfAOWYwFd+gwV1+ydghvxfPJThqK6d2SyQD2vYuU+LHq7PfR
rXHMIvMzeeKR5ntmQRPjuMNUGta+r2FSYnIbkBLJRcqS1mBwOIbOnQLe2ThRa+vu
8OwR//9hLOymPcwc9d+Oax+GDFyKYH4W86fJxi0qB8OdyUhnZJ9j+87VZtUge98V
qYy0nQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSe5vdwUj97
vZ/bmqIYnsBj3FDbnjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ABSgNCIqeZ6JihRp9xnYfvW08BJnjNvGlaJ6Ezty2FiSdbYq4SP/2SUa5R3sda05
c3AW/gRHqLQUqHnEluG52NWASPIMv60LhAOkG11kBXLMtjm4WRuQpy8H7SkaeCbl
1Sxzu5xLahh5CdLG2Bxmav1zJkh14RuMNlWAXWA+8BiLRb1jplwx/TcRmbT72nI0
K7PamY51ZZ++Gdz7+iVjR8e8lJzla0cC5OwD10hiZU4pm/XocoR//47C3d880AkE
FtCkuv8NGhWHOv0P73ohUV8Nw/SYMBD5btrG06ihjXoLeTcvSHTpIVUVIZiuznvX
ept+4CpbfVYw2YNSjpihFDk=
-----END CERTIFICATE-----`

export const handler = middy(async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  try {
    const decodedToken = verifyToken(
      event.authorizationToken,
      certificate
    );

    console.log("User was authorized", decodedToken);

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message);
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
})

function verifyToken(authHeader: string, certificate: string): JwtToken {

  if (!authHeader)
    throw new Error("No authentication header");

  if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(' ');
  const token = split[1];

  return verify(token, certificate, { algorithms: ['RS256'] }) as JwtToken;
}
