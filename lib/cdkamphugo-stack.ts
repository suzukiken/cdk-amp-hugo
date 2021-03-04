import * as cdk from '@aws-cdk/core';
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as amplify from "@aws-cdk/aws-amplify";
import * as iam from "@aws-cdk/aws-iam";
import * as codebuild from "@aws-cdk/aws-codebuild";

export class CdkamphugoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const DOMAIN_NAME = 'example.com' // replace example.com with which you have zone in Route53
    const SUBDOMAIN_NAME = 'blog' // replace blog
    const AMPLIFY_APP_NAME = 'blogapp' // replace blogapp
    const REPOSITORY_NAME = AMPLIFY_APP_NAME // replace  
    const BASE_URL = 'https://' + SUBDOMAIN_NAME + '.' + DOMAIN_NAME + '/'

    const repository = new codecommit.Repository(this, "repository", {
      repositoryName: REPOSITORY_NAME
    })

    const app = new amplify.App(this, "amplifyapp", {
      appName: AMPLIFY_APP_NAME,
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        repository: repository,
      }),
      environmentVariables: {
        BASEURL: BASE_URL,
      }
    })
    
    const masterBranch = app.addBranch('master', {
      branchName: 'master'
    })

    const domain = new amplify.Domain(this, "cdkamp_domain", {
      app: app,
      domainName: DOMAIN_NAME,
      subDomains: [
        {
          branch: masterBranch,
          prefix: SUBDOMAIN_NAME,
        },
      ],
    })

    app.addCustomRule({
      source: "/<*>",
      target: "/index.html",
      status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
    })
    
  }
}
