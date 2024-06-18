/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import Utils from "@support/utils";

describe("publisher-003-05 : Runtime configuration - OAuth2 and api key security", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    let apiName;
    const apiVersion = '1.0.0';

    const oauth2AndApiKeySecuritySpec = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemRuntimeConfigurations').click();
            cy.get('#applicationLevel').click();
            // Checking the two options
            cy.get('#api-security-basic-auth-checkbox').click();
            cy.get('#api-security-api-key-checkbox').click();

            cy.get('#save-runtime-configurations').click();
            cy.wait(3000);
            cy.get('#save-runtime-configurations').then(() => {
                cy.get('#applicationLevel').click();
                cy.get('#api-security-basic-auth-checkbox').should('be.checked');
                cy.get('#api-security-api-key-checkbox').should('be.checked');
            })
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("OAuth2 and api key security spec - super admin", () => {
        oauth2AndApiKeySecuritySpec(superTenant);
    });
    it.only("OAuth2 and api key security spec - tenant user", () => {
        oauth2AndApiKeySecuritySpec(testTenant);
    });
});
