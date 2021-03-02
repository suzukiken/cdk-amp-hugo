#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkamphugoStack } from '../lib/cdkamphugo-stack';

const app = new cdk.App();
new CdkamphugoStack(app, 'CdkamphugoStack');
