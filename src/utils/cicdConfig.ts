
export interface CICDConfig {
  stages: CICDStage[];
  qualityGates: QualityGate[];
  notifications: NotificationConfig[];
}

export interface CICDStage {
  name: string;
  order: number;
  dependencies: string[];
  commands: string[];
  environment: string;
  timeout: number;
}

export interface QualityGate {
  name: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq';
  blocking: boolean;
}

export interface NotificationConfig {
  event: string;
  channels: string[];
  recipients: string[];
}

export const defaultCICDConfig: CICDConfig = {
  stages: [
    {
      name: 'test',
      order: 1,
      dependencies: [],
      commands: [
        'npm ci',
        'npm run lint',
        'npm run test:unit',
        'npm run test:coverage'
      ],
      environment: 'test',
      timeout: 300
    },
    {
      name: 'build',
      order: 2,
      dependencies: ['test'],
      commands: [
        'npm run build',
        'npm run test:e2e'
      ],
      environment: 'build',
      timeout: 600
    },
    {
      name: 'security',
      order: 3,
      dependencies: ['build'],
      commands: [
        'npm audit',
        'npm run security:scan'
      ],
      environment: 'security',
      timeout: 180
    },
    {
      name: 'deploy',
      order: 4,
      dependencies: ['security'],
      commands: [
        'npm run deploy:staging',
        'npm run smoke:test'
      ],
      environment: 'staging',
      timeout: 900
    }
  ],
  qualityGates: [
    {
      name: 'Test Coverage',
      metric: 'coverage',
      threshold: 80,
      operator: 'gt',
      blocking: true
    },
    {
      name: 'Code Quality',
      metric: 'quality_score',
      threshold: 85,
      operator: 'gt',
      blocking: true
    },
    {
      name: 'Security Score',
      metric: 'security_score',
      threshold: 90,
      operator: 'gt',
      blocking: true
    },
    {
      name: 'Performance Score',
      metric: 'performance_score',
      threshold: 75,
      operator: 'gt',
      blocking: false
    }
  ],
  notifications: [
    {
      event: 'pipeline_failed',
      channels: ['email', 'slack'],
      recipients: ['dev-team@company.com']
    },
    {
      event: 'quality_gate_failed',
      channels: ['slack'],
      recipients: ['#dev-alerts']
    },
    {
      event: 'deployment_success',
      channels: ['email'],
      recipients: ['stakeholders@company.com']
    }
  ]
};

export const generateGitHubActions = (config: CICDConfig): string => {
  return `
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
${config.stages.map(stage => `
  ${stage.name}:
    runs-on: ubuntu-latest
    ${stage.dependencies.length > 0 ? `needs: [${stage.dependencies.join(', ')}]` : ''}
    timeout-minutes: ${Math.floor(stage.timeout / 60)}
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    ${stage.commands.map(cmd => `
    - name: ${cmd}
      run: ${cmd}`).join('')}
`).join('')}

  quality-gates:
    runs-on: ubuntu-latest
    needs: [${config.stages.filter(s => s.name !== 'deploy').map(s => s.name).join(', ')}]
    
    steps:
    - uses: actions/checkout@v3
    
    ${config.qualityGates.map(gate => `
    - name: Check ${gate.name}
      run: |
        METRIC_VALUE=$(npm run get-metric -- ${gate.metric})
        if [ $METRIC_VALUE -${gate.operator === 'gt' ? 'lt' : gate.operator === 'lt' ? 'gt' : 'ne'} ${gate.threshold} ]; then
          echo "Quality gate failed: ${gate.name}"
          ${gate.blocking ? 'exit 1' : 'echo "Warning: Quality gate failed but not blocking"'}
        fi`).join('')}
`;
};
