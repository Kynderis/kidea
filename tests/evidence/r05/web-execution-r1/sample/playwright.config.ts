import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser', fullyParallel:false, workers:1, retries:0, forbidOnly:true,
 timeout:30000, expect:{timeout:5000}, reporter:[['list'],['json',{outputFile:'test-results/results.json'}]],
 use:{baseURL:'http://127.0.0.1:4173',headless:true,trace:'retain-on-failure'},
 projects:[{name:'chromium',use:{browserName:'chromium'}}],
 webServer:{command:`"${process.execPath}" build/index.js`,url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:15000,env:{HOST:'127.0.0.1',PORT:'4173',ORIGIN:'http://127.0.0.1:4173'}}
});
