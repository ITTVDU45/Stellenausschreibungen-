
Getting started with Apify API
The Apify API provides programmatic access to the Apify platform. The API is organized around RESTful HTTP endpoints.

HTTP Client

Apify API

Actor Run

Dataset

Key-Value Store

The diagram illustrates the basic workflow when using the Apify API:

Your application communicates with the Apify API by sending requests to run Actors and receiving results back.
When you request to run an Actor, the Apify API creates and manages an Actor run instance on the platform.
The Actor processes data and stores results in Apify's storage systems:
Dataset: Structured storage optimized for tabular or list-type data, ideal for scraped items or processed results.
Key-Value Store: Flexible storage for various data types (including images, JSON, HTML, and text), perfect for configuration settings and non-tabular outputs.
Prerequisites
Before you can start using the API, check if you have all the necessary prerequisites:

An Apify account with an API token.
A tool to make HTTP requests (cURL, Postman, or your preferred programming language).
Authentication
You must authenticate all API requests presented on this page. You can authenticate using your API token:

Authorization: Bearer YOUR_API_TOKEN

You can find your API token in Apify Console under Settings > API & Integrations.

Verify your account
To check your API credentials or account details:

Endpoint
GET https://api.apify.com/v2/users/me

Expected response codes:

200
Basic workflow
The most common workflow involving Apify API consists of the following steps:

Running an Actor.
Retrieving the results.
1. Run an Actor
Synchronously
For shorter runs where you need immediate results:

Endpoint
POST https://api.apify.com/v2/acts/:actorId/run-sync

Expected response codes:

201
400
408
Asynchronously
For longer-running operations or when you don't need immediate results.

Endpoint
POST https://api.apify.com/v2/acts/:actorId/runs

Expected response codes:

201
2. Retrieve results
From a Dataset
Most Actors store their results in a dataset:

Endpoint
GET https://api.apify.com/v2/datasets/:datasetId/items

Optional query parameters:

format=json (default), other possible formats are:
jsonl
xml
html
csv
xlsx
rss
limit=100 (number of items to retrieve)
offset=0 (pagination offset)
Expected response codes:

200
From a Key-value store
Endpoint
GET https://api.apify.com/v2/key-value-stores/:storeId/records/:recordKey

Expected response codes:

200
302
Additional operations
Get log
You can get a log for a specific run or build of an Actor.

Endpoint
GET https://api.apify.com/v2/logs/:buildOrRunId

Expected response codes:

200
Monitor run status
Endpoint
GET https://api.apify.com/v2/actor-runs/:runId

Expected response codes:

200
Store data in Dataset
To store your own data in a Dataset:

Endpoint
POST https://api.apify.com/v2/datasets/:datasetId/items

If any item in the request fails validation, the entire request will be rejected.

Expected response codes:

201
400
Store data in Key-value store
To store your own data in a Key-value store:

Endpoint
PUT https://api.apify.com/v2/key-value-stores/:storeId/records/:recordKey

Include your data in the request body and set the appropriate Content-Type header.

Expected response codes:

201
HTTP Status Code Descriptions
200 OK
The request has succeeded.

201 Created
The request has been fulfilled and a new resource has been created.

302 Found
A redirection response indicating that the requested resource has been temporarily moved to a different URL.

400 Bad Request
The server cannot process the request due to client error, such as request syntax, invalid request parameters, or invalid data format. This occurs when:

The request body contains invalid data
Required parameters are missing
Data validation fails for Dataset items
408 Request Timeout
The server timed out waiting for the request to complete.

# Get list of Actors


```
GET 
https://api.apify.com/v2/acts
```


Gets the list of all Actors that the user created or used. The response is a list of objects, where each object contains a basic information about a single Actor.

To only get Actors created by the user, add the `my=1` query parameter.

The endpoint supports pagination using the `limit` and `offset` parameters and it will not return more than 1000 records.

By default, the records are sorted by the `createdAt` field in ascending order, therefore you can use pagination to incrementally fetch all Actors while new ones are still being created. To sort the records in descending order, use the `desc=1` parameter.

You can also sort by your last run by using the `sortBy=stats.lastRunStartedAt` query parameter. In this case, descending order means the most recently run Actor appears first.

## Request

### Query Parameters

* **my** boolean

  If `true` or `1` then the returned list only contains Actors owned by the user. The default value is `false`.

  **Example:** `true`

  **offset** double

  Number of items that should be skipped at the start. The default value is `0`.

  **Example:** `0`

  **limit** double

  Maximum number of items to return. The default value as well as the maximum is `1000`.

  **Example:** `1000`

  **desc** boolean

  If `true` or `1` then the objects are sorted by the `createdAt` field in descending order. By default, they are sorted in ascending order.

  **Example:** `true`

  **sortBy** string

  **Possible values:** \[`createdAt`, `stats.lastRunStartedAt`]

  Field to sort the records by. The default is `createdAt`. You can also use `stats.lastRunStartedAt` to sort by the most recently ran Actors.

  **Example:** `createdAt`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "total": 2,
    "count": 2,
    "offset": 0,
    "limit": 1000,
    "desc": false,
    "items": [
      {
        "id": "br9CKmk457",
        "createdAt": "2019-10-29T07:34:24.202Z",
        "modifiedAt": "2019-10-30T07:34:24.202Z",
        "name": "MyAct",
        "username": "janedoe"
      },
      {
        "id": "ksiEKo23pz",
        "createdAt": "2019-11-30T07:34:24.202Z",
        "modifiedAt": "2019-12-12T07:34:24.202Z",
        "name": "MySecondAct",
        "username": "janedoe"
      }
    ]
  }
}
```


**Schema**

* **data** object required

  Common pagination fields for list responses.

  * **total** integer required

    The total number of items available across all pages.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **offset** integer required

    The starting position for this page of results.

    **Possible values:** `>= 0`

    **Example:** `0`

  * **limit** integer required

    The maximum number of items returned per page.

    **Possible values:** `>= 1`

    **Example:** `1000`

  * **desc** boolean required

    Whether the results are sorted in descending order.

    **Example:** `false`

  * **count** integer required

    The number of items returned in this response.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **items** object\[] required

    * **id** string required\
      **Example:** `br9CKmk457`

    * **createdAt** string\<date-time> required\
      **Example:** `2019-10-29T07:34:24.202Z`

    * **modifiedAt** string\<date-time> required\
      **Example:** `2019-10-30T07:34:24.202Z`

    * **name** string required\
      **Example:** `MyAct`

    * **username** string required\
      **Example:** `janedoe`

    * **title** string\
      **Example:** `Hello World Example`

    * **stats** object

      * anyOf
        * ActorStats
        * null
        **totalBuilds** integer\
        **Example:** `9`
      * **totalRuns** integer\
        **Example:** `16`
      * **totalUsers** integer\
        **Example:** `6`
      * **totalUsers7Days** integer\
        **Example:** `2`
      * **totalUsers30Days** integer\
        **Example:** `6`
      * **totalUsers90Days** integer\
        **Example:** `6`
      * **totalMetamorphs** integer\
        **Example:** `2`
      * **lastRunStartedAt** string\<date-time>\
        **Example:** `2019-07-08T14:01:05.546Z`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`


# Create Actor


```
POST 
https://api.apify.com/v2/acts
```


Creates a new Actor with settings specified in an Actor object passed as JSON in the POST payload. The response is the full Actor object as returned by the  endpoint.

The HTTP request must have the `Content-Type: application/json` HTTP header!

The Actor needs to define at least one version of the source code. For more information, see .

If you want to make your Actor [public](https://docs.apify.com/platform/actors/publishing) using `isPublic: true`, you will need to provide the Actor's `title` and the `categories` under which that Actor will be classified in Apify Store. For this, it's best to use the [constants from our apify-shared-js package](https://github.com/apify/apify-shared-js/blob/2d43ebc41ece9ad31cd6525bd523fb86939bf860/packages/consts/src/consts.ts#L452-L471).

## Request

<!-- -->

### Body**required**

* **name** string | null nullable\
  **Example:** `MyActor`

* **description** string | null nullable\
  **Example:** `My favourite actor!`

* **title** string | null nullable\
  **Example:** `My actor`

* **isPublic** boolean | null nullable\
  **Example:** `false`

* **seoTitle** string | null nullable\
  **Example:** `My actor`

* **seoDescription** string | null nullable\
  **Example:** `My actor is the best`

* **restartOnError** boolean deprecated\
  **Example:** `false`

* **versions** object\[]

  * **versionNumber** string required\
    **Example:** `0.0`

  * **sourceType** object required

    * anyOf

      * VersionSourceType
      * null

      VersionSourceType (string)

      **Possible values:** \[`SOURCE_FILES`, `GIT_REPO`, `TARBALL`, `GITHUB_GIST`]

  * **envVars** object\[]

    * **name** string required\
      **Example:** `MY_ENV_VAR`
    * **value** string required\
      **Example:** `my-value`
    * **isSecret** boolean | null nullable\
      **Example:** `false`

  * **applyEnvVarsToBuild** boolean | null nullable\
    **Example:** `false`

  * **buildTag** string\
    **Example:** `latest`

  * **sourceFiles** object\[]

    * anyOf

      * SourceCodeFile
      * SourceCodeFolder

      **format** SourceCodeFileFormat (string) required

      **Possible values:** \[`BASE64`, `TEXT`]

      **Example:** `TEXT`

    * **content** string required\
      **Example:** `console.log('This is the main.js file');`

    * **name** string required\
      **Example:** `src/main.js`

  * **gitRepoUrl** string | null nullable

    URL of the Git repository when sourceType is GIT\_REPO.

  * **tarballUrl** string | null nullable

    URL of the tarball when sourceType is TARBALL.

  * **gitHubGistUrl** string | null nullable

    URL of the GitHub Gist when sourceType is GITHUB\_GIST.

* **pricingInfos** object\[]

  * oneOf

    * PayPerEventActorPricingInfo
    * PricePerDatasetItemActorPricingInfo
    * FlatPricePerMonthActorPricingInfo
    * FreeActorPricingInfo

    **apifyMarginPercentage** number required

    In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

  * **createdAt** string\<date-time> required

    When this pricing info record has been created

  * **startedAt** string\<date-time> required

    Since when is this pricing info record effective for a given Actor

  * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

  * **notifiedAboutChangeAt** string,null\<date-time> nullable

  * **reasonForChange** string | null nullable

  * **pricingModel** PricingModel (string) required

    **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]

  * **pricingPerEvent** object required

    * **actorChargeEvents** object

      * **property name\*** ActorChargeEvent

        * **eventPriceUsd** number required
        * **eventTitle** string required
        * **eventDescription** string required

  * **minimalMaxTotalChargeUsd** number | null nullable

* **categories** string\[] nullable

* **defaultRunOptions** object

  * **build** string\
    **Example:** `latest`

  * **timeoutSecs** integer\
    **Example:** `3600`

  * **memoryMbytes** integer\
    **Example:** `2048`

  * **restartOnError** boolean\
    **Example:** `false`

  * **maxItems** integer | null nullable

  * **forcePermissionLevel** object

    * anyOf

      * ActorPermissionLevel
      * null

      ActorPermissionLevel (string)

      Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

      **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

      **Example:** `LIMITED_PERMISSIONS`

* **actorStandby** object

  * anyOf
    * ActorStandby
    * null
    **isEnabled** boolean | null nullable
  * **desiredRequestsPerActorRun** integer | null nullable
  * **maxRequestsPerActorRun** integer | null nullable
  * **idleTimeoutSecs** integer | null nullable
  * **build** string | null nullable
  * **memoryMbytes** integer | null nullable
  * **disableStandbyFieldsOverride** boolean | null nullable
  * **shouldPassActorInput** boolean | null nullable

* **exampleRunInput** object

  * anyOf
    * exampleRunInput
    * null
    **body** string\
    **Example:** `{ "helloWorld": 123 }`
  * **contentType** string\
    **Example:** `application/json; charset=utf-8`

* **isDeprecated** boolean | null nullable

### Status 201

**Response Headers**

* **Location**


```
{
  "data": {
    "id": "zdc3Pyhyz3m8vjDeM",
    "userId": "wRsJZtadYvn4mBZmm",
    "name": "MyActor",
    "username": "jane35",
    "description": "My favourite Actor!",
    "isPublic": false,
    "createdAt": "2019-07-08T11:27:57.401Z",
    "modifiedAt": "2019-07-08T14:01:05.546Z",
    "stats": {
      "totalBuilds": 9,
      "totalRuns": 16,
      "totalUsers": 6,
      "totalUsers7Days": 2,
      "totalUsers30Days": 6,
      "totalUsers90Days": 6,
      "totalMetamorphs": 2,
      "lastRunStartedAt": "2019-07-08T14:01:05.546Z"
    },
    "versions": [
      {
        "versionNumber": "0.1",
        "envVars": null,
        "sourceType": "SOURCE_FILES",
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "sourceFiles": []
      },
      {
        "versionNumber": "0.2",
        "sourceType": "GIT_REPO",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitRepoUrl": "https://github.com/jane35/my-actor"
      },
      {
        "versionNumber": "0.3",
        "sourceType": "TARBALL",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "tarballUrl": "https://github.com/jane35/my-actor/archive/master.zip"
      },
      {
        "versionNumber": "0.4",
        "sourceType": "GITHUB_GIST",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitHubGistUrl": "https://gist.github.com/jane35/e51feb784yu89"
      }
    ],
    "defaultRunOptions": {
      "build": "latest",
      "timeoutSecs": 3600,
      "memoryMbytes": 2048,
      "restartOnError": false
    },
    "exampleRunInput": {
      "body": "{ \"helloWorld\": 123 }",
      "contentType": "application/json; charset=utf-8"
    },
    "isDeprecated": false,
    "deploymentKey": "ssh-rsa AAAA ...",
    "title": "My Actor",
    "taggedBuilds": {
      "latest": {
        "buildId": "z2EryhbfhgSyqj6Hn",
        "buildNumber": "0.0.2",
        "finishedAt": "2019-06-10T11:15:49.286Z"
      }
    }
  }
}
```


**Schema**

* **data** object required

  * **id** string required\
    **Example:** `zdc3Pyhyz3m8vjDeM`

  * **userId** string required\
    **Example:** `wRsJZtadYvn4mBZmm`

  * **name** string required\
    **Example:** `MyActor`

  * **username** string required\
    **Example:** `jane35`

  * **description** string | null nullable\
    **Example:** `My favourite actor!`

  * **restartOnError** boolean deprecated\
    **Example:** `false`

  * **isPublic** boolean required\
    **Example:** `false`

  * **actorPermissionLevel** ActorPermissionLevel (string)

    Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

    **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

    **Example:** `LIMITED_PERMISSIONS`

  * **createdAt** string\<date-time> required\
    **Example:** `2019-07-08T11:27:57.401Z`

  * **modifiedAt** string\<date-time> required\
    **Example:** `2019-07-08T14:01:05.546Z`

  * **stats** object required

    * **totalBuilds** integer\
      **Example:** `9`
    * **totalRuns** integer\
      **Example:** `16`
    * **totalUsers** integer\
      **Example:** `6`
    * **totalUsers7Days** integer\
      **Example:** `2`
    * **totalUsers30Days** integer\
      **Example:** `6`
    * **totalUsers90Days** integer\
      **Example:** `6`
    * **totalMetamorphs** integer\
      **Example:** `2`
    * **lastRunStartedAt** string\<date-time>\
      **Example:** `2019-07-08T14:01:05.546Z`

  * **versions** object\[] required

    * **versionNumber** string required\
      **Example:** `0.0`

    * **sourceType** object required

      * anyOf

        * VersionSourceType
        * null

        VersionSourceType (string)

        **Possible values:** \[`SOURCE_FILES`, `GIT_REPO`, `TARBALL`, `GITHUB_GIST`]

    * **envVars** object\[]

      * **name** string required\
        **Example:** `MY_ENV_VAR`
      * **value** string required\
        **Example:** `my-value`
      * **isSecret** boolean | null nullable\
        **Example:** `false`

    * **applyEnvVarsToBuild** boolean | null nullable\
      **Example:** `false`

    * **buildTag** string\
      **Example:** `latest`

    * **sourceFiles** object\[]

      * anyOf

        * SourceCodeFile
        * SourceCodeFolder

        **format** SourceCodeFileFormat (string) required

        **Possible values:** \[`BASE64`, `TEXT`]

        **Example:** `TEXT`

      * **content** string required\
        **Example:** `console.log('This is the main.js file');`

      * **name** string required\
        **Example:** `src/main.js`

    * **gitRepoUrl** string | null nullable

      URL of the Git repository when sourceType is GIT\_REPO.

    * **tarballUrl** string | null nullable

      URL of the tarball when sourceType is TARBALL.

    * **gitHubGistUrl** string | null nullable

      URL of the GitHub Gist when sourceType is GITHUB\_GIST.

  * **pricingInfos** object\[]

    * oneOf

      * PayPerEventActorPricingInfo
      * PricePerDatasetItemActorPricingInfo
      * FlatPricePerMonthActorPricingInfo
      * FreeActorPricingInfo

      **apifyMarginPercentage** number required

      In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

    * **createdAt** string\<date-time> required

      When this pricing info record has been created

    * **startedAt** string\<date-time> required

      Since when is this pricing info record effective for a given Actor

    * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

    * **notifiedAboutChangeAt** string,null\<date-time> nullable

    * **reasonForChange** string | null nullable

    * **pricingModel** PricingModel (string) required

      **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]

    * **pricingPerEvent** object required

      * **actorChargeEvents** object

        * **property name\*** ActorChargeEvent

          * **eventPriceUsd** number required
          * **eventTitle** string required
          * **eventDescription** string required

    * **minimalMaxTotalChargeUsd** number | null nullable

  * **defaultRunOptions** object required

    * **build** string\
      **Example:** `latest`

    * **timeoutSecs** integer\
      **Example:** `3600`

    * **memoryMbytes** integer\
      **Example:** `2048`

    * **restartOnError** boolean\
      **Example:** `false`

    * **maxItems** integer | null nullable

    * **forcePermissionLevel** object

      * anyOf

        * ActorPermissionLevel
        * null

        ActorPermissionLevel (string)

        Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

        **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

        **Example:** `LIMITED_PERMISSIONS`

  * **exampleRunInput** object

    * anyOf
      * exampleRunInput
      * null
      **body** string\
      **Example:** `{ "helloWorld": 123 }`
    * **contentType** string\
      **Example:** `application/json; charset=utf-8`

  * **isDeprecated** boolean | null nullable\
    **Example:** `false`

  * **deploymentKey** string\
    **Example:** `ssh-rsa AAAA ...`

  * **title** string | null nullable\
    **Example:** `My Actor`

  * **taggedBuilds** object

    * anyOf

      * TaggedBuilds
      * null

      object

      A dictionary mapping build tag names (e.g., "latest", "beta") to their build information.

      **Example:** `{"latest":{"buildId":"z2EryhbfhgSyqj6Hn","buildNumber":"0.0.2","finishedAt":"2019-06-10T11:15:49.286Z"},"beta":{"buildId":"abc123def456","buildNumber":"1.0.0-beta","finishedAt":"2019-07-15T14:30:00.000Z"}}`

  * **actorStandby** object

    * anyOf
      * ActorStandby
      * null
      **isEnabled** boolean | null nullable
    * **desiredRequestsPerActorRun** integer | null nullable
    * **maxRequestsPerActorRun** integer | null nullable
    * **idleTimeoutSecs** integer | null nullable
    * **build** string | null nullable
    * **memoryMbytes** integer | null nullable
    * **disableStandbyFieldsOverride** boolean | null nullable
    * **shouldPassActorInput** boolean | null nullable

  * **readmeSummary** string

    A brief, LLM-generated readme summary

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 413

Payload too large - the request body exceeds the size limit.


```
{
  "error": {
    "type": "request-too-large",
    "message": "The POST payload is too large (limit: 9437184 bytes, actual length: 10485760 bytes)."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 415

Unsupported media type - the Content-Encoding of the request is not supported.


```
{
  "error": {
    "type": "unsupported-content-encoding",
    "message": "Content-Encoding \"bla\" is not supported."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`


# Get Actor


```
GET 
https://api.apify.com/v2/acts/:actorId
```


Gets an object that contains all the details about a specific Actor.

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "id": "zdc3Pyhyz3m8vjDeM",
    "userId": "wRsJZtadYvn4mBZmm",
    "name": "MyActor",
    "username": "jane35",
    "description": "My favourite Actor!",
    "isPublic": false,
    "createdAt": "2019-07-08T11:27:57.401Z",
    "modifiedAt": "2019-07-08T14:01:05.546Z",
    "stats": {
      "totalBuilds": 9,
      "totalRuns": 16,
      "totalUsers": 6,
      "totalUsers7Days": 2,
      "totalUsers30Days": 6,
      "totalUsers90Days": 6,
      "totalMetamorphs": 2,
      "lastRunStartedAt": "2019-07-08T14:01:05.546Z"
    },
    "versions": [
      {
        "versionNumber": "0.1",
        "envVars": null,
        "sourceType": "SOURCE_FILES",
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "sourceFiles": []
      },
      {
        "versionNumber": "0.2",
        "sourceType": "GIT_REPO",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitRepoUrl": "https://github.com/jane35/my-actor"
      },
      {
        "versionNumber": "0.3",
        "sourceType": "TARBALL",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "tarballUrl": "https://github.com/jane35/my-actor/archive/master.zip"
      },
      {
        "versionNumber": "0.4",
        "sourceType": "GITHUB_GIST",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitHubGistUrl": "https://gist.github.com/jane35/e51feb784yu89"
      }
    ],
    "defaultRunOptions": {
      "build": "latest",
      "timeoutSecs": 3600,
      "memoryMbytes": 2048,
      "restartOnError": false
    },
    "exampleRunInput": {
      "body": "{ \"helloWorld\": 123 }",
      "contentType": "application/json; charset=utf-8"
    },
    "isDeprecated": false,
    "deploymentKey": "ssh-rsa AAAA ...",
    "title": "My Actor",
    "taggedBuilds": {
      "latest": {
        "buildId": "z2EryhbfhgSyqj6Hn",
        "buildNumber": "0.0.2",
        "finishedAt": "2019-06-10T11:15:49.286Z"
      }
    }
  }
}
```


**Schema**

* **data** object required

  * **id** string required\
    **Example:** `zdc3Pyhyz3m8vjDeM`

  * **userId** string required\
    **Example:** `wRsJZtadYvn4mBZmm`

  * **name** string required\
    **Example:** `MyActor`

  * **username** string required\
    **Example:** `jane35`

  * **description** string | null nullable\
    **Example:** `My favourite actor!`

  * **restartOnError** boolean deprecated\
    **Example:** `false`

  * **isPublic** boolean required\
    **Example:** `false`

  * **actorPermissionLevel** ActorPermissionLevel (string)

    Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

    **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

    **Example:** `LIMITED_PERMISSIONS`

  * **createdAt** string\<date-time> required\
    **Example:** `2019-07-08T11:27:57.401Z`

  * **modifiedAt** string\<date-time> required\
    **Example:** `2019-07-08T14:01:05.546Z`

  * **stats** object required

    * **totalBuilds** integer\
      **Example:** `9`
    * **totalRuns** integer\
      **Example:** `16`
    * **totalUsers** integer\
      **Example:** `6`
    * **totalUsers7Days** integer\
      **Example:** `2`
    * **totalUsers30Days** integer\
      **Example:** `6`
    * **totalUsers90Days** integer\
      **Example:** `6`
    * **totalMetamorphs** integer\
      **Example:** `2`
    * **lastRunStartedAt** string\<date-time>\
      **Example:** `2019-07-08T14:01:05.546Z`

  * **versions** object\[] required

    * **versionNumber** string required\
      **Example:** `0.0`

    * **sourceType** object required

      * anyOf

        * VersionSourceType
        * null

        VersionSourceType (string)

        **Possible values:** \[`SOURCE_FILES`, `GIT_REPO`, `TARBALL`, `GITHUB_GIST`]

    * **envVars** object\[]

      * **name** string required\
        **Example:** `MY_ENV_VAR`
      * **value** string required\
        **Example:** `my-value`
      * **isSecret** boolean | null nullable\
        **Example:** `false`

    * **applyEnvVarsToBuild** boolean | null nullable\
      **Example:** `false`

    * **buildTag** string\
      **Example:** `latest`

    * **sourceFiles** object\[]

      * anyOf

        * SourceCodeFile
        * SourceCodeFolder

        **format** SourceCodeFileFormat (string) required

        **Possible values:** \[`BASE64`, `TEXT`]

        **Example:** `TEXT`

      * **content** string required\
        **Example:** `console.log('This is the main.js file');`

      * **name** string required\
        **Example:** `src/main.js`

    * **gitRepoUrl** string | null nullable

      URL of the Git repository when sourceType is GIT\_REPO.

    * **tarballUrl** string | null nullable

      URL of the tarball when sourceType is TARBALL.

    * **gitHubGistUrl** string | null nullable

      URL of the GitHub Gist when sourceType is GITHUB\_GIST.

  * **pricingInfos** object\[]

    * oneOf

      * PayPerEventActorPricingInfo
      * PricePerDatasetItemActorPricingInfo
      * FlatPricePerMonthActorPricingInfo
      * FreeActorPricingInfo

      **apifyMarginPercentage** number required

      In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

    * **createdAt** string\<date-time> required

      When this pricing info record has been created

    * **startedAt** string\<date-time> required

      Since when is this pricing info record effective for a given Actor

    * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

    * **notifiedAboutChangeAt** string,null\<date-time> nullable

    * **reasonForChange** string | null nullable

    * **pricingModel** PricingModel (string) required

      **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]

    * **pricingPerEvent** object required

      * **actorChargeEvents** object

        * **property name\*** ActorChargeEvent

          * **eventPriceUsd** number required
          * **eventTitle** string required
          * **eventDescription** string required

    * **minimalMaxTotalChargeUsd** number | null nullable

  * **defaultRunOptions** object required

    * **build** string\
      **Example:** `latest`

    * **timeoutSecs** integer\
      **Example:** `3600`

    * **memoryMbytes** integer\
      **Example:** `2048`

    * **restartOnError** boolean\
      **Example:** `false`

    * **maxItems** integer | null nullable

    * **forcePermissionLevel** object

      * anyOf

        * ActorPermissionLevel
        * null

        ActorPermissionLevel (string)

        Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

        **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

        **Example:** `LIMITED_PERMISSIONS`

  * **exampleRunInput** object

    * anyOf
      * exampleRunInput
      * null
      **body** string\
      **Example:** `{ "helloWorld": 123 }`
    * **contentType** string\
      **Example:** `application/json; charset=utf-8`

  * **isDeprecated** boolean | null nullable\
    **Example:** `false`

  * **deploymentKey** string\
    **Example:** `ssh-rsa AAAA ...`

  * **title** string | null nullable\
    **Example:** `My Actor`

  * **taggedBuilds** object

    * anyOf

      * TaggedBuilds
      * null

      object

      A dictionary mapping build tag names (e.g., "latest", "beta") to their build information.

      **Example:** `{"latest":{"buildId":"z2EryhbfhgSyqj6Hn","buildNumber":"0.0.2","finishedAt":"2019-06-10T11:15:49.286Z"},"beta":{"buildId":"abc123def456","buildNumber":"1.0.0-beta","finishedAt":"2019-07-15T14:30:00.000Z"}}`

  * **actorStandby** object

    * anyOf
      * ActorStandby
      * null
      **isEnabled** boolean | null nullable
    * **desiredRequestsPerActorRun** integer | null nullable
    * **maxRequestsPerActorRun** integer | null nullable
    * **idleTimeoutSecs** integer | null nullable
    * **build** string | null nullable
    * **memoryMbytes** integer | null nullable
    * **disableStandbyFieldsOverride** boolean | null nullable
    * **shouldPassActorInput** boolean | null nullable

  * **readmeSummary** string

    A brief, LLM-generated readme summary

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Update Actor


```
PUT 
https://api.apify.com/v2/acts/:actorId
```


Updates settings of an Actor using values specified by an Actor object passed as JSON in the POST payload. If the object does not define a specific property, its value will not be updated.

The response is the full Actor object as returned by the  endpoint.

The request needs to specify the `Content-Type: application/json` HTTP header!

When providing your API authentication token, we recommend using the request's `Authorization` header, rather than the URL. ().

If you want to make your Actor [public](https://docs.apify.com/platform/actors/publishing) using `isPublic: true`, you will need to provide the Actor's `title` and the `categories` under which that Actor will be classified in Apify Store. For this, it's best to use the [constants from our apify-shared-js package](https://github.com/apify/apify-shared-js/blob/2d43ebc41ece9ad31cd6525bd523fb86939bf860/packages/consts/src/consts.ts#L452-L471).

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

### Body**required**

* **name** string\
  **Example:** `MyActor`

* **description** string | null nullable\
  **Example:** `My favourite actor!`

* **isPublic** boolean\
  **Example:** `false`

* **actorPermissionLevel** object

  * anyOf

    * ActorPermissionLevel
    * null

    ActorPermissionLevel (string)

    Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

    **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

    **Example:** `LIMITED_PERMISSIONS`

* **seoTitle** string | null nullable\
  **Example:** `My actor`

* **seoDescription** string | null nullable\
  **Example:** `My actor is the best`

* **title** string | null nullable\
  **Example:** `My Actor`

* **restartOnError** boolean deprecated\
  **Example:** `false`

* **versions** object\[]

  * **versionNumber** string | null nullable\
    **Example:** `0.0`

  * **sourceType** object

    * anyOf

      * VersionSourceType
      * null

      VersionSourceType (string)

      **Possible values:** \[`SOURCE_FILES`, `GIT_REPO`, `TARBALL`, `GITHUB_GIST`]

  * **envVars** object\[]

    * **name** string required\
      **Example:** `MY_ENV_VAR`
    * **value** string required\
      **Example:** `my-value`
    * **isSecret** boolean | null nullable\
      **Example:** `false`

  * **applyEnvVarsToBuild** boolean | null nullable\
    **Example:** `false`

  * **buildTag** string | null nullable\
    **Example:** `latest`

  * **sourceFiles** object\[]

    * anyOf

      * SourceCodeFile
      * SourceCodeFolder

      **format** SourceCodeFileFormat (string) required

      **Possible values:** \[`BASE64`, `TEXT`]

      **Example:** `TEXT`

    * **content** string required\
      **Example:** `console.log('This is the main.js file');`

    * **name** string required\
      **Example:** `src/main.js`

  * **gitRepoUrl** string | null nullable

    URL of the Git repository when sourceType is GIT\_REPO.

  * **tarballUrl** string | null nullable

    URL of the tarball when sourceType is TARBALL.

  * **gitHubGistUrl** string | null nullable

    URL of the GitHub Gist when sourceType is GITHUB\_GIST.

* **pricingInfos** object\[]

  * oneOf

    * PayPerEventActorPricingInfo
    * PricePerDatasetItemActorPricingInfo
    * FlatPricePerMonthActorPricingInfo
    * FreeActorPricingInfo

    **apifyMarginPercentage** number required

    In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

  * **createdAt** string\<date-time> required

    When this pricing info record has been created

  * **startedAt** string\<date-time> required

    Since when is this pricing info record effective for a given Actor

  * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

  * **notifiedAboutChangeAt** string,null\<date-time> nullable

  * **reasonForChange** string | null nullable

  * **pricingModel** PricingModel (string) required

    **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]

  * **pricingPerEvent** object required

    * **actorChargeEvents** object

      * **property name\*** ActorChargeEvent

        * **eventPriceUsd** number required
        * **eventTitle** string required
        * **eventDescription** string required

  * **minimalMaxTotalChargeUsd** number | null nullable

* **categories** string\[] nullable

* **defaultRunOptions** object

  * anyOf
    * defaultRunOptions
    * null
    **build** string\
    **Example:** `latest`

  * **timeoutSecs** integer\
    **Example:** `3600`

  * **memoryMbytes** integer\
    **Example:** `2048`

  * **restartOnError** boolean\
    **Example:** `false`

  * **maxItems** integer | null nullable

  * **forcePermissionLevel** object

    * anyOf

      * ActorPermissionLevel
      * null

      ActorPermissionLevel (string)

      Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

      **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

      **Example:** `LIMITED_PERMISSIONS`

* **taggedBuilds** object,null

  An object to modify tags on the Actor's builds. The key is the tag name (e.g., *latest*), and the value is either an object with a `buildId` or `null`.

  This operation is a patch; any existing tags that you omit from this object will be preserved.

  * **To create or reassign a tag**, provide the tag name with a `buildId`. e.g., to assign the *latest* tag:


    ```
    {
      "latest": {
        "buildId": "z2EryhbfhgSyqj6Hn"
      }
    }
    ```


  * **To remove a tag**, provide the tag name with a `null` value. e.g., to remove the *beta* tag:


    ```
    {
      "beta": null
    }
    ```


  * **To perform multiple operations**, combine them. The following reassigns *latest* and removes *beta*, while preserving any other existing tags.


    ```
    {
      "latest": {
        "buildId": "z2EryhbfhgSyqj6Hn"
      },
      "beta": null
    }
    ```


  - **property name\*** BuildTag

    * **buildId** string required

* **actorStandby** object

  * anyOf
    * ActorStandby
    * null
    **isEnabled** boolean | null nullable
  * **desiredRequestsPerActorRun** integer | null nullable
  * **maxRequestsPerActorRun** integer | null nullable
  * **idleTimeoutSecs** integer | null nullable
  * **build** string | null nullable
  * **memoryMbytes** integer | null nullable
  * **disableStandbyFieldsOverride** boolean | null nullable
  * **shouldPassActorInput** boolean | null nullable

* **exampleRunInput** object

  * anyOf
    * exampleRunInput
    * null
    **body** string\
    **Example:** `{ "helloWorld": 123 }`
  * **contentType** string\
    **Example:** `application/json; charset=utf-8`

* **isDeprecated** boolean | null nullable

### Status 200

**Response Headers**




```
{
  "data": {
    "id": "zdc3Pyhyz3m8vjDeM",
    "userId": "wRsJZtadYvn4mBZmm",
    "name": "MyActor",
    "username": "jane35",
    "description": "My favourite Actor!",
    "isPublic": false,
    "actorPermissionLevel": "LIMITED_PERMISSIONS",
    "createdAt": "2019-07-08T11:27:57.401Z",
    "modifiedAt": "2019-07-08T14:01:05.546Z",
    "stats": {
      "totalBuilds": 9,
      "totalRuns": 16,
      "totalUsers": 6,
      "totalUsers7Days": 2,
      "totalUsers30Days": 6,
      "totalUsers90Days": 6,
      "totalMetamorphs": 2,
      "lastRunStartedAt": "2019-07-08T14:01:05.546Z"
    },
    "versions": [
      {
        "versionNumber": "0.1",
        "envVars": null,
        "sourceType": "SOURCE_FILES",
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "sourceFiles": []
      },
      {
        "versionNumber": "0.2",
        "sourceType": "GIT_REPO",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitRepoUrl": "https://github.com/jane35/my-actor"
      },
      {
        "versionNumber": "0.3",
        "sourceType": "TARBALL",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "tarballUrl": "https://github.com/jane35/my-actor/archive/master.zip"
      },
      {
        "versionNumber": "0.4",
        "sourceType": "GITHUB_GIST",
        "envVars": null,
        "applyEnvVarsToBuild": false,
        "buildTag": "latest",
        "gitHubGistUrl": "https://gist.github.com/jane35/e51feb784yu89"
      }
    ],
    "defaultRunOptions": {
      "build": "latest",
      "timeoutSecs": 3600,
      "memoryMbytes": 2048,
      "restartOnError": false
    },
    "exampleRunInput": {
      "body": "{ \"helloWorld\": 123 }",
      "contentType": "application/json; charset=utf-8"
    },
    "isDeprecated": false,
    "deploymentKey": "ssh-rsa AAAA ...",
    "title": "My Actor",
    "taggedBuilds": {
      "latest": {
        "buildId": "z2EryhbfhgSyqj6Hn",
        "buildNumber": "0.0.2",
        "finishedAt": "2019-06-10T11:15:49.286Z"
      }
    }
  }
}
```


**Schema**

* **data** object required

  * **id** string required\
    **Example:** `zdc3Pyhyz3m8vjDeM`

  * **userId** string required\
    **Example:** `wRsJZtadYvn4mBZmm`

  * **name** string required\
    **Example:** `MyActor`

  * **username** string required\
    **Example:** `jane35`

  * **description** string | null nullable\
    **Example:** `My favourite actor!`

  * **restartOnError** boolean deprecated\
    **Example:** `false`

  * **isPublic** boolean required\
    **Example:** `false`

  * **actorPermissionLevel** ActorPermissionLevel (string)

    Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

    **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

    **Example:** `LIMITED_PERMISSIONS`

  * **createdAt** string\<date-time> required\
    **Example:** `2019-07-08T11:27:57.401Z`

  * **modifiedAt** string\<date-time> required\
    **Example:** `2019-07-08T14:01:05.546Z`

  * **stats** object required

    * **totalBuilds** integer\
      **Example:** `9`
    * **totalRuns** integer\
      **Example:** `16`
    * **totalUsers** integer\
      **Example:** `6`
    * **totalUsers7Days** integer\
      **Example:** `2`
    * **totalUsers30Days** integer\
      **Example:** `6`
    * **totalUsers90Days** integer\
      **Example:** `6`
    * **totalMetamorphs** integer\
      **Example:** `2`
    * **lastRunStartedAt** string\<date-time>\
      **Example:** `2019-07-08T14:01:05.546Z`

  * **versions** object\[] required

    * **versionNumber** string required\
      **Example:** `0.0`

    * **sourceType** object required

      * anyOf

        * VersionSourceType
        * null

        VersionSourceType (string)

        **Possible values:** \[`SOURCE_FILES`, `GIT_REPO`, `TARBALL`, `GITHUB_GIST`]

    * **envVars** object\[]

      * **name** string required\
        **Example:** `MY_ENV_VAR`
      * **value** string required\
        **Example:** `my-value`
      * **isSecret** boolean | null nullable\
        **Example:** `false`

    * **applyEnvVarsToBuild** boolean | null nullable\
      **Example:** `false`

    * **buildTag** string\
      **Example:** `latest`

    * **sourceFiles** object\[]

      * anyOf

        * SourceCodeFile
        * SourceCodeFolder

        **format** SourceCodeFileFormat (string) required

        **Possible values:** \[`BASE64`, `TEXT`]

        **Example:** `TEXT`

      * **content** string required\
        **Example:** `console.log('This is the main.js file');`

      * **name** string required\
        **Example:** `src/main.js`

    * **gitRepoUrl** string | null nullable

      URL of the Git repository when sourceType is GIT\_REPO.

    * **tarballUrl** string | null nullable

      URL of the tarball when sourceType is TARBALL.

    * **gitHubGistUrl** string | null nullable

      URL of the GitHub Gist when sourceType is GITHUB\_GIST.

  * **pricingInfos** object\[]

    * oneOf

      * PayPerEventActorPricingInfo
      * PricePerDatasetItemActorPricingInfo
      * FlatPricePerMonthActorPricingInfo
      * FreeActorPricingInfo

      **apifyMarginPercentage** number required

      In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

    * **createdAt** string\<date-time> required

      When this pricing info record has been created

    * **startedAt** string\<date-time> required

      Since when is this pricing info record effective for a given Actor

    * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

    * **notifiedAboutChangeAt** string,null\<date-time> nullable

    * **reasonForChange** string | null nullable

    * **pricingModel** PricingModel (string) required

      **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]

    * **pricingPerEvent** object required

      * **actorChargeEvents** object

        * **property name\*** ActorChargeEvent

          * **eventPriceUsd** number required
          * **eventTitle** string required
          * **eventDescription** string required

    * **minimalMaxTotalChargeUsd** number | null nullable

  * **defaultRunOptions** object required

    * **build** string\
      **Example:** `latest`

    * **timeoutSecs** integer\
      **Example:** `3600`

    * **memoryMbytes** integer\
      **Example:** `2048`

    * **restartOnError** boolean\
      **Example:** `false`

    * **maxItems** integer | null nullable

    * **forcePermissionLevel** object

      * anyOf

        * ActorPermissionLevel
        * null

        ActorPermissionLevel (string)

        Determines permissions that the Actor requires to run. For more information, see the [Actor permissions documentation](https://docs.apify.com/platform/actors/development/permissions).

        **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

        **Example:** `LIMITED_PERMISSIONS`

  * **exampleRunInput** object

    * anyOf
      * exampleRunInput
      * null
      **body** string\
      **Example:** `{ "helloWorld": 123 }`
    * **contentType** string\
      **Example:** `application/json; charset=utf-8`

  * **isDeprecated** boolean | null nullable\
    **Example:** `false`

  * **deploymentKey** string\
    **Example:** `ssh-rsa AAAA ...`

  * **title** string | null nullable\
    **Example:** `My Actor`

  * **taggedBuilds** object

    * anyOf

      * TaggedBuilds
      * null

      object

      A dictionary mapping build tag names (e.g., "latest", "beta") to their build information.

      **Example:** `{"latest":{"buildId":"z2EryhbfhgSyqj6Hn","buildNumber":"0.0.2","finishedAt":"2019-06-10T11:15:49.286Z"},"beta":{"buildId":"abc123def456","buildNumber":"1.0.0-beta","finishedAt":"2019-07-15T14:30:00.000Z"}}`

  * **actorStandby** object

    * anyOf
      * ActorStandby
      * null
      **isEnabled** boolean | null nullable
    * **desiredRequestsPerActorRun** integer | null nullable
    * **maxRequestsPerActorRun** integer | null nullable
    * **idleTimeoutSecs** integer | null nullable
    * **build** string | null nullable
    * **memoryMbytes** integer | null nullable
    * **disableStandbyFieldsOverride** boolean | null nullable
    * **shouldPassActorInput** boolean | null nullable

  * **readmeSummary** string

    A brief, LLM-generated readme summary

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 413

Payload too large - the request body exceeds the size limit.


```
{
  "error": {
    "type": "request-too-large",
    "message": "The POST payload is too large (limit: 9437184 bytes, actual length: 10485760 bytes)."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 415

Unsupported media type - the Content-Encoding of the request is not supported.


```
{
  "error": {
    "type": "unsupported-content-encoding",
    "message": "Content-Encoding \"bla\" is not supported."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`



# Delete Actor


```
DELETE 
https://api.apify.com/v2/acts/:actorId
```


Deletes an Actor.

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

<!-- -->

### Status 204

**Response Headers**




```
{}
```


**Schema**

* **object** object\
  **Example:** `{}`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`


# Get list of runs


```
GET 
https://api.apify.com/v2/acts/:actorId/runs
```


Gets the list of runs of a specific Actor. The response is a list of objects, where each object contains basic information about a single Actor run.

The endpoint supports pagination using the `limit` and `offset` parameters and it will not return more than 1000 array elements.

By default, the records are sorted by the `startedAt` field in ascending order, therefore you can use pagination to incrementally fetch all records while new ones are still being created. To sort the records in descending order, use `desc=1` parameter. You can also filter runs by status ([available statuses](https://docs.apify.com/platform/actors/running/runs-and-builds#lifecycle)).

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

### Query Parameters

* **offset** double

  Number of items that should be skipped at the start. The default value is `0`.

  **Example:** `0`

  **limit** double

  Maximum number of items to return. The default value as well as the maximum is `1000`.

  **Example:** `1000`

  **desc** boolean

  If `true` or `1` then the objects are sorted by the `startedAt` field in descending order. By default, they are sorted in ascending order.

  **Example:** `true`

  **status** string

  Single status or comma-separated list of statuses, see ([available statuses](https://docs.apify.com/platform/actors/running/runs-and-builds#lifecycle)). Used to filter runs by the specified statuses only.

  **Example:** `SUCCEEDED`

  **startedAfter** date-time

  Filter runs that started after the specified date and time (inclusive). The value must be a valid ISO 8601 datetime string (UTC).

  **Example:** `2025-09-01T00:00:00.000Z`

  **startedBefore** date-time

  Filter runs that started before the specified date and time (inclusive). The value must be a valid ISO 8601 datetime string (UTC).

  **Example:** `2025-09-17T23:59:59.000Z`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "total": 2,
    "offset": 0,
    "limit": 1000,
    "desc": false,
    "count": 2,
    "items": [
      {
        "id": "HG7ML7M8z78YcAPEB",
        "actId": "HDSasDasz78YcAPEB",
        "actorTaskId": "KJHSKHausidyaJKHs",
        "status": "SUCCEEDED",
        "startedAt": "2019-11-30T07:34:24.202Z",
        "finishedAt": "2019-12-12T09:30:12.202Z",
        "buildId": "HG7ML7M8z78YcAPEB",
        "buildNumber": "0.0.2",
        "meta": {
          "origin": "WEB"
        },
        "usageTotalUsd": 0.2,
        "defaultKeyValueStoreId": "sfAjeR4QmeJCQzTfe",
        "defaultDatasetId": "3ZojQDdFTsyE7Moy4",
        "defaultRequestQueueId": "so93g2shcDzK3pA85"
      },
      {
        "id": "HG7ML7M8z78YcAPEB",
        "actId": "HDSasDasz78YcAPEB",
        "actorTaskId": "KJHSKHausidyaJKHs",
        "status": "FAILED",
        "startedAt": "2019-12-12T07:34:14.202Z",
        "finishedAt": "2019-12-13T08:36:13.202Z",
        "buildId": "u78dML7M8z78YcAPEB",
        "buildNumber": "0.2.2",
        "meta": {
          "origin": "DEVELOPMENT"
        },
        "usageTotalUsd": 0.6,
        "defaultKeyValueStoreId": "sffsouqlseJCQzTfe",
        "defaultDatasetId": "CFGggdjQDsyE7Moyw",
        "defaultRequestQueueId": "soowucklrmDzKpA8x"
      }
    ]
  }
}
```


**Schema**

* **data** object required

  Common pagination fields for list responses.

  * **total** integer required

    The total number of items available across all pages.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **offset** integer required

    The starting position for this page of results.

    **Possible values:** `>= 0`

    **Example:** `0`

  * **limit** integer required

    The maximum number of items returned per page.

    **Possible values:** `>= 1`

    **Example:** `1000`

  * **desc** boolean required

    Whether the results are sorted in descending order.

    **Example:** `false`

  * **count** integer required

    The number of items returned in this response.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **items** object\[] required

    * **id** string required\
      **Example:** `HG7ML7M8z78YcAPEB`

    * **actId** string required\
      **Example:** `HDSasDasz78YcAPEB`

    * **actorTaskId** string | null nullable\
      **Example:** `KJHSKHausidyaJKHs`

    * **status** ActorJobStatus (string) required

      Status of an Actor job (run or build).

      **Possible values:** \[`READY`, `RUNNING`, `SUCCEEDED`, `FAILED`, `TIMING-OUT`, `TIMED-OUT`, `ABORTING`, `ABORTED`]

    * **startedAt** string\<date-time> required\
      **Example:** `2019-11-30T07:34:24.202Z`

    * **finishedAt** string,null\<date-time> nullable\
      **Example:** `2019-12-12T09:30:12.202Z`

    * **buildId** string required\
      **Example:** `HG7ML7M8z78YcAPEB`

    * **buildNumber** string\
      **Example:** `0.0.2`

    * **meta** object required

      * **origin** RunOrigin (string) required

        **Possible values:** \[`DEVELOPMENT`, `WEB`, `API`, `SCHEDULER`, `TEST`, `WEBHOOK`, `ACTOR`, `CLI`, `STANDBY`]

      * **clientIp** string | null nullable

        IP address of the client that started the run.

      * **userAgent** string | null nullable

        User agent of the client that started the run.

      * **scheduleId** string | null nullable

        ID of the schedule that triggered the run.

      * **scheduledAt** string,null\<date-time> nullable

        Time when the run was scheduled.

    * **usageTotalUsd** number required\
      **Example:** `0.2`

    * **defaultKeyValueStoreId** string required\
      **Example:** `sfAjeR4QmeJCQzTfe`

    * **defaultDatasetId** string required\
      **Example:** `3ZojQDdFTsyE7Moy4`

    * **defaultRequestQueueId** string required\
      **Example:** `so93g2shcDzK3pA85`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

# Run Actor


```
POST 
https://api.apify.com/v2/acts/:actorId/runs
```


Runs an Actor and immediately returns without waiting for the run to finish.

The POST payload including its `Content-Type` header is passed as `INPUT` to the Actor (usually `application/json`).

The Actor is started with the default options; you can override them using various URL query parameters.

The response is the Run object as returned by the  API endpoint.

If you want to wait for the run to finish and receive the actual output of the Actor as the response, please use one of the  API endpoints instead.

To fetch the Actor run results that are typically stored in the default dataset, you'll need to pass the ID received in the `defaultDatasetId` field received in the response JSON to the  API endpoint.

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

### Query Parameters

* **timeout** double

  Optional timeout for the run, in seconds. By default, the run uses the timeout from its configuration.

  **Example:** `60`

  **memory** double

  Memory limit for the run, in megabytes. The amount of memory can be set to a power of 2 with a minimum of 128. By default, the run uses the memory limit from its configuration.

  **Example:** `256`

  **maxItems** double

  Specifies the maximum number of dataset items that will be charged for pay-per-result Actors. This does NOT guarantee that the Actor will return only this many items. It only ensures you won't be charged for more than this number of items. Only works for pay-per-result Actors. Value can be accessed in the actor run using `ACTOR_MAX_PAID_DATASET_ITEMS` environment variable.

  **Example:** `1000`

  **maxTotalChargeUsd** double

  Specifies the maximum cost of the run. This parameter is useful for pay-per-event Actors, as it allows you to limit the amount charged to your subscription. You can access the maximum cost in your Actor by using the `ACTOR_MAX_TOTAL_CHARGE_USD` environment variable.

  **Example:** `5`

  **restartOnError** boolean

  Determines whether the run will be restarted if it fails.

  **Example:** `false`

  **build** string

  Specifies the Actor build to run. It can be either a build tag or build number. By default, the run uses the build from its configuration (typically `latest`).

  **Example:** `0.1.234`

  **waitForFinish** double

  The maximum number of seconds the server waits for the run to finish. By default it is `0`, the maximum value is `60`. <!-- -->If the run finishes in time then the returned run object will have a terminal status (e.g. `SUCCEEDED`), otherwise it will have a transitional status (e.g. `RUNNING`).

  **Example:** `60`

  **webhooks** string

  Specifies optional webhooks associated with the Actor run, which can be used to receive a notification e.g. when the Actor finished or failed. The value is a Base64-encoded JSON array of objects defining the webhooks. For more information, see [Webhooks documentation](https://docs.apify.com/platform/integrations/webhooks).

  **Example:** `dGhpcyBpcyBqdXN0IGV4YW1wbGUK...`

  **forcePermissionLevel** string

  **Possible values:** \[`LIMITED_PERMISSIONS`, `FULL_PERMISSIONS`]

  Overrides the Actor's permission level for this specific run. Use to test restricted permissions before deploying changes to your Actor or to temporarily elevate or restrict access. If you don't specify this parameter, the Actor uses its configured default permission level. For more information on permissions, see the [documentation](https://docs.apify.com/platform/actors/development/permissions).

  **Example:** `LIMITED_PERMISSIONS`

### Body**required**

* **object** object

### Status 201

**Response Headers**

* **Location**


```
{
  "data": {
    "id": "HG7ML7M8z78YcAPEB",
    "actId": "HDSasDasz78YcAPEB",
    "userId": "7sT5jcggjjA9fNcxF",
    "actorTaskId": "KJHSKHausidyaJKHs",
    "startedAt": "2019-11-30T07:34:24.202Z",
    "finishedAt": "2019-12-12T09:30:12.202Z",
    "status": "READY",
    "statusMessage": "Actor is running",
    "isStatusMessageTerminal": false,
    "meta": {
      "origin": "DEVELOPMENT",
      "clientIp": "string",
      "userAgent": "string",
      "scheduleId": "string",
      "scheduledAt": "2024-07-29T15:51:28.071Z"
    },
    "pricingInfo": {
      "apifyMarginPercentage": 0,
      "createdAt": "2024-07-29T15:51:28.071Z",
      "startedAt": "2024-07-29T15:51:28.071Z",
      "notifiedAboutFutureChangeAt": "2024-07-29T15:51:28.071Z",
      "notifiedAboutChangeAt": "2024-07-29T15:51:28.071Z",
      "reasonForChange": "string",
      "pricingModel": "PAY_PER_EVENT",
      "pricingPerEvent": {
        "actorChargeEvents": {}
      },
      "minimalMaxTotalChargeUsd": 0
    },
    "stats": {
      "inputBodyLen": 240,
      "migrationCount": 0,
      "rebootCount": 0,
      "restartCount": 0,
      "resurrectCount": 2,
      "memAvgBytes": 267874071.9,
      "memMaxBytes": 404713472,
      "memCurrentBytes": 0,
      "cpuAvgUsage": 33.7532101107538,
      "cpuMaxUsage": 169.650735534941,
      "cpuCurrentUsage": 0,
      "netRxBytes": 103508042,
      "netTxBytes": 4854600,
      "durationMillis": 248472,
      "runTimeSecs": 248.472,
      "metamorph": 0,
      "computeUnits": 0.13804
    },
    "chargedEventCounts": {
      "actor-start": 1,
      "page-crawled": 150,
      "data-extracted": 75
    },
    "options": {
      "build": "latest",
      "timeoutSecs": 300,
      "memoryMbytes": 1024,
      "diskMbytes": 2048,
      "maxItems": 1000,
      "maxTotalChargeUsd": 5
    },
    "buildId": "7sT5jcggjjA9fNcxF",
    "exitCode": 0,
    "generalAccess": "RESTRICTED",
    "defaultKeyValueStoreId": "eJNzqsbPiopwJcgGQ",
    "defaultDatasetId": "wmKPijuyDnPZAPRMk",
    "defaultRequestQueueId": "FL35cSF7jrxr3BY39",
    "storageIds": {
      "datasets": {
        "default": "wmKPijuyDnPZAPRMk"
      },
      "keyValueStores": {
        "default": "eJNzqsbPiopwJcgGQ"
      },
      "requestQueues": {
        "default": "FL35cSF7jrxr3BY39"
      }
    },
    "buildNumber": "0.0.36",
    "containerUrl": "https://g8kd8kbc5ge8.runs.apify.net",
    "isContainerServerReady": true,
    "gitBranchName": "master",
    "usage": {
      "ACTOR_COMPUTE_UNITS": 3,
      "DATASET_READS": 4,
      "DATASET_WRITES": 4,
      "KEY_VALUE_STORE_READS": 5,
      "KEY_VALUE_STORE_WRITES": 3,
      "KEY_VALUE_STORE_LISTS": 5,
      "REQUEST_QUEUE_READS": 2,
      "REQUEST_QUEUE_WRITES": 1,
      "DATA_TRANSFER_INTERNAL_GBYTES": 1,
      "DATA_TRANSFER_EXTERNAL_GBYTES": 3,
      "PROXY_RESIDENTIAL_TRANSFER_GBYTES": 34,
      "PROXY_SERPS": 3
    },
    "usageTotalUsd": 0.2654,
    "usageUsd": {
      "ACTOR_COMPUTE_UNITS": 0.0003,
      "DATASET_READS": 0.0001,
      "DATASET_WRITES": 0.0001,
      "KEY_VALUE_STORE_READS": 0.0001,
      "KEY_VALUE_STORE_WRITES": 0.00005,
      "KEY_VALUE_STORE_LISTS": 0.0001,
      "REQUEST_QUEUE_READS": 0.0001,
      "REQUEST_QUEUE_WRITES": 0.0001,
      "DATA_TRANSFER_INTERNAL_GBYTES": 0.001,
      "DATA_TRANSFER_EXTERNAL_GBYTES": 0.003,
      "PROXY_RESIDENTIAL_TRANSFER_GBYTES": 0.034,
      "PROXY_SERPS": 0.003
    },
    "metamorphs": [
      {
        "createdAt": "2019-11-30T07:39:24.202Z",
        "actorId": "nspoEjklmnsF2oosD",
        "buildId": "ME6oKecqy5kXDS4KQ",
        "inputKey": "INPUT-METAMORPH-1"
      }
    ]
  }
}
```


**Schema**

* **data** object required

  Represents an Actor run and its associated data.

  * **id** string required

    Unique identifier of the Actor run.

    **Example:** `HG7ML7M8z78YcAPEB`

  * **actId** string required

    ID of the Actor that was run.

    **Example:** `HDSasDasz78YcAPEB`

  * **userId** string required

    ID of the user who started the run.

    **Example:** `7sT5jcggjjA9fNcxF`

  * **actorTaskId** string | null nullable

    ID of the Actor task, if the run was started from a task.

    **Example:** `KJHSKHausidyaJKHs`

  * **startedAt** string\<date-time> required

    Time when the Actor run started.

    **Example:** `2019-11-30T07:34:24.202Z`

  * **finishedAt** string,null\<date-time> nullable

    Time when the Actor run finished.

    **Example:** `2019-12-12T09:30:12.202Z`

  * **status** ActorJobStatus (string) required

    Status of an Actor job (run or build).

    **Possible values:** \[`READY`, `RUNNING`, `SUCCEEDED`, `FAILED`, `TIMING-OUT`, `TIMED-OUT`, `ABORTING`, `ABORTED`]

  * **statusMessage** string | null nullable

    Detailed message about the run status.

    **Example:** `Actor is running`

  * **isStatusMessageTerminal** boolean | null nullable

    Whether the status message is terminal (final).

    **Example:** `false`

  * **meta** object required

    Metadata about the Actor run.

    * **origin** RunOrigin (string) required

      **Possible values:** \[`DEVELOPMENT`, `WEB`, `API`, `SCHEDULER`, `TEST`, `WEBHOOK`, `ACTOR`, `CLI`, `STANDBY`]

    * **clientIp** string | null nullable

      IP address of the client that started the run.

    * **userAgent** string | null nullable

      User agent of the client that started the run.

    * **scheduleId** string | null nullable

      ID of the schedule that triggered the run.

    * **scheduledAt** string,null\<date-time> nullable

      Time when the run was scheduled.

  * **pricingInfo** object

    Pricing information for the Actor.

    * **pricingModel**

      Pricing information for the Actor.

      **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]
      * **PAY\_PER\_EVENT**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **pricingPerEvent** object required

          * **actorChargeEvents** object

            * **property name\*** ActorChargeEvent

              * **eventPriceUsd** number required
              * **eventTitle** string required
              * **eventDescription** string required

        * **minimalMaxTotalChargeUsd** number | null nullable

      * **PRICE\_PER\_DATASET\_ITEM**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **unitName** string required

          Name of the unit that is being charged

        * **pricePerUnitUsd** number required

      * **FLAT\_PRICE\_PER\_MONTH**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **trialMinutes** integer required

          For how long this Actor can be used for free in trial period

        * **pricePerUnitUsd** number required

          Monthly flat price in USD

      * **FREE**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

  * **stats** object required

    Statistics of the Actor run.

    * **inputBodyLen** integer

      **Possible values:** `>= 0`

      **Example:** `240`

    * **migrationCount** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **rebootCount** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **restartCount** integer required

      **Possible values:** `>= 0`

      **Example:** `0`

    * **resurrectCount** integer required

      **Possible values:** `>= 0`

      **Example:** `2`

    * **memAvgBytes** number\
      **Example:** `267874071.9`

    * **memMaxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `404713472`

    * **memCurrentBytes** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **cpuAvgUsage** number\
      **Example:** `33.7532101107538`

    * **cpuMaxUsage** number\
      **Example:** `169.650735534941`

    * **cpuCurrentUsage** number\
      **Example:** `0`

    * **netRxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `103508042`

    * **netTxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `4854600`

    * **durationMillis** integer

      **Possible values:** `>= 0`

      **Example:** `248472`

    * **runTimeSecs** number

      **Possible values:** `>= 0`

      **Example:** `248.472`

    * **metamorph** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **computeUnits** number required

      **Possible values:** `>= 0`

      **Example:** `0.13804`

  * **chargedEventCounts** object

    A map of charged event types to their counts. The keys are event type identifiers defined by the Actor's pricing model (pay-per-event), and the values are the number of times each event was charged during this run.

    * **property name\*** integer

  * **options** object required

    Configuration options for the Actor run.

    * **build** string required\
      **Example:** `latest`

    * **timeoutSecs** integer required

      **Possible values:** `>= 0`

      **Example:** `300`

    * **memoryMbytes** integer required

      **Possible values:** `>= 128` and `<= 32768`

      **Example:** `1024`

    * **diskMbytes** integer required

      **Possible values:** `>= 0`

      **Example:** `2048`

    * **maxItems** integer

      **Possible values:** `>= 1`

      **Example:** `1000`

    * **maxTotalChargeUsd** number

      **Possible values:** `>= 0`

      **Example:** `5`

  * **buildId** string required

    ID of the Actor build used for this run.

    **Example:** `7sT5jcggjjA9fNcxF`

  * **exitCode** integer | null nullable

    Exit code of the Actor run process.

    **Example:** `0`

  * **generalAccess** GeneralAccess (string) required

    General access level for the Actor run.

    **Possible values:** \[`ANYONE_WITH_ID_CAN_READ`, `ANYONE_WITH_NAME_CAN_READ`, `FOLLOW_USER_SETTING`, `RESTRICTED`]

    **Example:** `RESTRICTED`

  * **defaultKeyValueStoreId** string required

    ID of the default key-value store for this run.

    **Example:** `eJNzqsbPiopwJcgGQ`

  * **defaultDatasetId** string required

    ID of the default dataset for this run.

    **Example:** `wmKPijuyDnPZAPRMk`

  * **defaultRequestQueueId** string required

    ID of the default request queue for this run.

    **Example:** `FL35cSF7jrxr3BY39`

  * **storageIds** object

    A map of aliased storage IDs associated with this run, grouped by storage type.

    * **datasets** object

      Aliased dataset IDs for this run.

      * **default** string

        ID of the default dataset for this run.

        **Example:** `wmKPijuyDnPZAPRMk`

      * **property name\*** string

    * **keyValueStores** object

      Aliased key-value store IDs for this run.

      * **default** string

        ID of the default key-value store for this run.

        **Example:** `eJNzqsbPiopwJcgGQ`

      * **property name\*** string

    * **requestQueues** object

      Aliased request queue IDs for this run.

      * **default** string

        ID of the default request queue for this run.

        **Example:** `FL35cSF7jrxr3BY39`

      * **property name\*** string

  * **buildNumber** string

    Build number of the Actor build used for this run.

    **Example:** `0.0.36`

  * **containerUrl** string\<uri>

    URL of the container running the Actor.

    **Example:** `https://g8kd8kbc5ge8.runs.apify.net`

  * **isContainerServerReady** boolean | null nullable

    Whether the container's HTTP server is ready to accept requests.

    **Example:** `true`

  * **gitBranchName** string | null nullable

    Name of the git branch used for the Actor build.

    **Example:** `master`

  * **usage** object

    Resource usage statistics for the run.

    * anyOf
      * RunUsage
      * null
      **ACTOR\_COMPUTE\_UNITS** number | null nullable\
      **Example:** `3`
    * **DATASET\_READS** integer | null nullable\
      **Example:** `4`
    * **DATASET\_WRITES** integer | null nullable\
      **Example:** `4`
    * **KEY\_VALUE\_STORE\_READS** integer | null nullable\
      **Example:** `5`
    * **KEY\_VALUE\_STORE\_WRITES** integer | null nullable\
      **Example:** `3`
    * **KEY\_VALUE\_STORE\_LISTS** integer | null nullable\
      **Example:** `5`
    * **REQUEST\_QUEUE\_READS** integer | null nullable\
      **Example:** `2`
    * **REQUEST\_QUEUE\_WRITES** integer | null nullable\
      **Example:** `1`
    * **DATA\_TRANSFER\_INTERNAL\_GBYTES** number | null nullable\
      **Example:** `1`
    * **DATA\_TRANSFER\_EXTERNAL\_GBYTES** number | null nullable\
      **Example:** `3`
    * **PROXY\_RESIDENTIAL\_TRANSFER\_GBYTES** number | null nullable\
      **Example:** `34`
    * **PROXY\_SERPS** integer | null nullable\
      **Example:** `3`

  * **usageTotalUsd** number | null nullable

    Total cost in USD for this run. Represents what you actually pay. For run owners: includes platform usage (compute units) and/or event costs depending on the Actor's pricing model. For run non-owners: only available for Pay-Per-Event Actors (event costs only). Not available for Pay-Per-Result Actors when you're not the Actor owner.

    **Example:** `0.2654`

  * **usageUsd** object

    Platform usage costs breakdown in USD. Only present if you own the run AND are paying for platform usage (Pay-Per-Usage, Rental, or Pay-Per-Event with usage costs like standby Actors). Not available for standard Pay-Per-Event Actors or Pay-Per-Result Actors owned by others.

    * anyOf
      * RunUsageUsd
      * null
      **ACTOR\_COMPUTE\_UNITS** number | null nullable\
      **Example:** `0.0003`
    * **DATASET\_READS** number | null nullable\
      **Example:** `0.0001`
    * **DATASET\_WRITES** number | null nullable\
      **Example:** `0.0001`
    * **KEY\_VALUE\_STORE\_READS** number | null nullable\
      **Example:** `0.0001`
    * **KEY\_VALUE\_STORE\_WRITES** number | null nullable\
      **Example:** `0.00005`
    * **KEY\_VALUE\_STORE\_LISTS** number | null nullable\
      **Example:** `0.0001`
    * **REQUEST\_QUEUE\_READS** number | null nullable\
      **Example:** `0.0001`
    * **REQUEST\_QUEUE\_WRITES** number | null nullable\
      **Example:** `0.0001`
    * **DATA\_TRANSFER\_INTERNAL\_GBYTES** number | null nullable\
      **Example:** `0.001`
    * **DATA\_TRANSFER\_EXTERNAL\_GBYTES** number | null nullable\
      **Example:** `0.003`
    * **PROXY\_RESIDENTIAL\_TRANSFER\_GBYTES** number | null nullable\
      **Example:** `0.034`
    * **PROXY\_SERPS** number | null nullable\
      **Example:** `0.003`

  * **metamorphs** object

    List of metamorph events that occurred during the run.

    * anyOf

      * object\[]
      * null

      **createdAt** string\<date-time> required

      Time when the metamorph occurred.

      **Example:** `2019-11-30T07:39:24.202Z`

    * **actorId** string required

      ID of the Actor that the run was metamorphed to.

      **Example:** `nspoEjklmnsF2oosD`

    * **buildId** string required

      ID of the build used for the metamorphed Actor.

      **Example:** `ME6oKecqy5kXDS4KQ`

    * **inputKey** string | null nullable

      Key of the input record in the key-value store.

      **Example:** `INPUT-METAMORPH-1`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 413

Payload too large - the request body exceeds the size limit.


```
{
  "error": {
    "type": "request-too-large",
    "message": "The POST payload is too large (limit: 9437184 bytes, actual length: 10485760 bytes)."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 415

Unsupported media type - the Content-Encoding of the request is not supported.


```
{
  "error": {
    "type": "unsupported-content-encoding",
    "message": "Content-Encoding \"bla\" is not supported."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

# Abort run


```
POST 
https://api.apify.com/v2/acts/:actorId/runs/:runId/abort
```


deprecated

This endpoint has been deprecated and may be replaced or removed in future versions of the API.

**\[DEPRECATED]** API endpoints related to run of the Actor were moved under new namespace . Aborts an Actor run and returns an object that contains all the details about the run.

Only runs that are starting or running are aborted. For runs with status `FINISHED`, `FAILED`, `ABORTING` and `TIMED-OUT` this call does nothing.

## Request

### Path Parameters

* **actorId** string required

  Actor ID or a tilde-separated owner's username and Actor name.

  **Example:** `janedoe~my-actor`

  **runId** string required

  Actor run ID.

  **Example:** `3KH8gEpp4d8uQSe8T`

### Query Parameters

* **gracefully** boolean

  If true passed, the Actor run will abort gracefully. It will send `aborting` and `persistState` event into run and force-stop the run after 30 seconds. It is helpful in cases where you plan to resurrect the run later.

  **Example:** `true`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "id": "HG7ML7M8z78YcAPEB",
    "actId": "janedoe~my-actor",
    "userId": "BPWZBd7Z9c746JAng",
    "actorTaskId": "rANaydYhUxjsnA3oz",
    "startedAt": "2019-11-30T07:34:24.202Z",
    "finishedAt": "2019-12-12T09:30:12.202Z",
    "status": "ABORTED",
    "statusMessage": "Actor was aborted",
    "isStatusMessageTerminal": true,
    "meta": {
      "origin": "WEB",
      "clientIp": "172.234.12.34",
      "userAgent": "Mozilla/5.0 (iPad)"
    },
    "stats": {
      "inputBodyLen": 240,
      "migrationCount": 0,
      "restartCount": 0,
      "resurrectCount": 1,
      "memAvgBytes": 35914228.4,
      "memMaxBytes": 38244352,
      "memCurrentBytes": 0,
      "cpuAvgUsage": 0.00955965,
      "cpuMaxUsage": 3.1546,
      "cpuCurrentUsage": 0,
      "netRxBytes": 2652,
      "netTxBytes": 1338,
      "durationMillis": 26239,
      "runTimeSecs": 26.239,
      "metamorph": 0,
      "computeUnits": 0.0072886
    },
    "options": {
      "build": "latest",
      "timeoutSecs": 300,
      "memoryMbytes": 1024,
      "diskMbytes": 2048
    },
    "buildId": "7sT5jcggjjA9fNcxF",
    "exitCode": 0,
    "generalAccess": "RESTRICTED",
    "defaultKeyValueStoreId": "eJNzqsbPiopwJcgGQ",
    "defaultDatasetId": "wmKPijuyDnPZAPRMk",
    "defaultRequestQueueId": "FL35cSF7jrxr3BY39",
    "storageIds": {
      "datasets": {
        "default": "wmKPijuyDnPZAPRMk"
      },
      "keyValueStores": {
        "default": "eJNzqsbPiopwJcgGQ"
      },
      "requestQueues": {
        "default": "FL35cSF7jrxr3BY39"
      }
    },
    "isContainerServerReady": false,
    "gitBranchName": "master",
    "usage": {
      "ACTOR_COMPUTE_UNITS": 3,
      "DATASET_READS": 4,
      "DATASET_WRITES": 4,
      "KEY_VALUE_STORE_READS": 5,
      "KEY_VALUE_STORE_WRITES": 3,
      "KEY_VALUE_STORE_LISTS": 5,
      "REQUEST_QUEUE_READS": 2,
      "REQUEST_QUEUE_WRITES": 1,
      "DATA_TRANSFER_INTERNAL_GBYTES": 1,
      "DATA_TRANSFER_EXTERNAL_GBYTES": 3,
      "PROXY_RESIDENTIAL_TRANSFER_GBYTES": 34,
      "PROXY_SERPS": 3
    },
    "usageTotalUsd": 0.2654,
    "usageUsd": {
      "ACTOR_COMPUTE_UNITS": 0.072,
      "DATASET_READS": 0.0004,
      "DATASET_WRITES": 0.0002,
      "KEY_VALUE_STORE_READS": 0.0006,
      "KEY_VALUE_STORE_WRITES": 0.002,
      "KEY_VALUE_STORE_LISTS": 0.004,
      "REQUEST_QUEUE_READS": 0.005,
      "REQUEST_QUEUE_WRITES": 0.02,
      "DATA_TRANSFER_INTERNAL_GBYTES": 0.0004,
      "DATA_TRANSFER_EXTERNAL_GBYTES": 0.0002,
      "PROXY_RESIDENTIAL_TRANSFER_GBYTES": 0.16,
      "PROXY_SERPS": 0.0006
    }
  }
}
```


**Schema**

* **data** object required

  Represents an Actor run and its associated data.

  * **id** string required

    Unique identifier of the Actor run.

    **Example:** `HG7ML7M8z78YcAPEB`

  * **actId** string required

    ID of the Actor that was run.

    **Example:** `HDSasDasz78YcAPEB`

  * **userId** string required

    ID of the user who started the run.

    **Example:** `7sT5jcggjjA9fNcxF`

  * **actorTaskId** string | null nullable

    ID of the Actor task, if the run was started from a task.

    **Example:** `KJHSKHausidyaJKHs`

  * **startedAt** string\<date-time> required

    Time when the Actor run started.

    **Example:** `2019-11-30T07:34:24.202Z`

  * **finishedAt** string,null\<date-time> nullable

    Time when the Actor run finished.

    **Example:** `2019-12-12T09:30:12.202Z`

  * **status** ActorJobStatus (string) required

    Status of an Actor job (run or build).

    **Possible values:** \[`READY`, `RUNNING`, `SUCCEEDED`, `FAILED`, `TIMING-OUT`, `TIMED-OUT`, `ABORTING`, `ABORTED`]

  * **statusMessage** string | null nullable

    Detailed message about the run status.

    **Example:** `Actor is running`

  * **isStatusMessageTerminal** boolean | null nullable

    Whether the status message is terminal (final).

    **Example:** `false`

  * **meta** object required

    Metadata about the Actor run.

    * **origin** RunOrigin (string) required

      **Possible values:** \[`DEVELOPMENT`, `WEB`, `API`, `SCHEDULER`, `TEST`, `WEBHOOK`, `ACTOR`, `CLI`, `STANDBY`]

    * **clientIp** string | null nullable

      IP address of the client that started the run.

    * **userAgent** string | null nullable

      User agent of the client that started the run.

    * **scheduleId** string | null nullable

      ID of the schedule that triggered the run.

    * **scheduledAt** string,null\<date-time> nullable

      Time when the run was scheduled.

  * **pricingInfo** object

    Pricing information for the Actor.

    * **pricingModel**

      Pricing information for the Actor.

      **Possible values:** \[`PAY_PER_EVENT`, `PRICE_PER_DATASET_ITEM`, `FLAT_PRICE_PER_MONTH`, `FREE`]
      * **PAY\_PER\_EVENT**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **pricingPerEvent** object required

          * **actorChargeEvents** object

            * **property name\*** ActorChargeEvent

              * **eventPriceUsd** number required
              * **eventTitle** string required
              * **eventDescription** string required

        * **minimalMaxTotalChargeUsd** number | null nullable

      * **PRICE\_PER\_DATASET\_ITEM**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **unitName** string required

          Name of the unit that is being charged

        * **pricePerUnitUsd** number required

      * **FLAT\_PRICE\_PER\_MONTH**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

        * **trialMinutes** integer required

          For how long this Actor can be used for free in trial period

        * **pricePerUnitUsd** number required

          Monthly flat price in USD

      * **FREE**

        * **apifyMarginPercentage** number required

          In \[0, 1], fraction of pricePerUnitUsd that goes to Apify

        * **createdAt** string\<date-time> required

          When this pricing info record has been created

        * **startedAt** string\<date-time> required

          Since when is this pricing info record effective for a given Actor

        * **notifiedAboutFutureChangeAt** string,null\<date-time> nullable

        * **notifiedAboutChangeAt** string,null\<date-time> nullable

        * **reasonForChange** string | null nullable

  * **stats** object required

    Statistics of the Actor run.

    * **inputBodyLen** integer

      **Possible values:** `>= 0`

      **Example:** `240`

    * **migrationCount** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **rebootCount** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **restartCount** integer required

      **Possible values:** `>= 0`

      **Example:** `0`

    * **resurrectCount** integer required

      **Possible values:** `>= 0`

      **Example:** `2`

    * **memAvgBytes** number\
      **Example:** `267874071.9`

    * **memMaxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `404713472`

    * **memCurrentBytes** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **cpuAvgUsage** number\
      **Example:** `33.7532101107538`

    * **cpuMaxUsage** number\
      **Example:** `169.650735534941`

    * **cpuCurrentUsage** number\
      **Example:** `0`

    * **netRxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `103508042`

    * **netTxBytes** integer

      **Possible values:** `>= 0`

      **Example:** `4854600`

    * **durationMillis** integer

      **Possible values:** `>= 0`

      **Example:** `248472`

    * **runTimeSecs** number

      **Possible values:** `>= 0`

      **Example:** `248.472`

    * **metamorph** integer

      **Possible values:** `>= 0`

      **Example:** `0`

    * **computeUnits** number required

      **Possible values:** `>= 0`

      **Example:** `0.13804`

  * **chargedEventCounts** object

    A map of charged event types to their counts. The keys are event type identifiers defined by the Actor's pricing model (pay-per-event), and the values are the number of times each event was charged during this run.

    * **property name\*** integer

  * **options** object required

    Configuration options for the Actor run.

    * **build** string required\
      **Example:** `latest`

    * **timeoutSecs** integer required

      **Possible values:** `>= 0`

      **Example:** `300`

    * **memoryMbytes** integer required

      **Possible values:** `>= 128` and `<= 32768`

      **Example:** `1024`

    * **diskMbytes** integer required

      **Possible values:** `>= 0`

      **Example:** `2048`

    * **maxItems** integer

      **Possible values:** `>= 1`

      **Example:** `1000`

    * **maxTotalChargeUsd** number

      **Possible values:** `>= 0`

      **Example:** `5`

  * **buildId** string required

    ID of the Actor build used for this run.

    **Example:** `7sT5jcggjjA9fNcxF`

  * **exitCode** integer | null nullable

    Exit code of the Actor run process.

    **Example:** `0`

  * **generalAccess** GeneralAccess (string) required

    General access level for the Actor run.

    **Possible values:** \[`ANYONE_WITH_ID_CAN_READ`, `ANYONE_WITH_NAME_CAN_READ`, `FOLLOW_USER_SETTING`, `RESTRICTED`]

    **Example:** `RESTRICTED`

  * **defaultKeyValueStoreId** string required

    ID of the default key-value store for this run.

    **Example:** `eJNzqsbPiopwJcgGQ`

  * **defaultDatasetId** string required

    ID of the default dataset for this run.

    **Example:** `wmKPijuyDnPZAPRMk`

  * **defaultRequestQueueId** string required

    ID of the default request queue for this run.

    **Example:** `FL35cSF7jrxr3BY39`

  * **storageIds** object

    A map of aliased storage IDs associated with this run, grouped by storage type.

    * **datasets** object

      Aliased dataset IDs for this run.

      * **default** string

        ID of the default dataset for this run.

        **Example:** `wmKPijuyDnPZAPRMk`

      * **property name\*** string

    * **keyValueStores** object

      Aliased key-value store IDs for this run.

      * **default** string

        ID of the default key-value store for this run.

        **Example:** `eJNzqsbPiopwJcgGQ`

      * **property name\*** string

    * **requestQueues** object

      Aliased request queue IDs for this run.

      * **default** string

        ID of the default request queue for this run.

        **Example:** `FL35cSF7jrxr3BY39`

      * **property name\*** string

  * **buildNumber** string

    Build number of the Actor build used for this run.

    **Example:** `0.0.36`

  * **containerUrl** string\<uri>

    URL of the container running the Actor.

    **Example:** `https://g8kd8kbc5ge8.runs.apify.net`

  * **isContainerServerReady** boolean | null nullable

    Whether the container's HTTP server is ready to accept requests.

    **Example:** `true`

  * **gitBranchName** string | null nullable

    Name of the git branch used for the Actor build.

    **Example:** `master`

  * **usage** object

    Resource usage statistics for the run.

    * anyOf
      * RunUsage
      * null
      **ACTOR\_COMPUTE\_UNITS** number | null nullable\
      **Example:** `3`
    * **DATASET\_READS** integer | null nullable\
      **Example:** `4`
    * **DATASET\_WRITES** integer | null nullable\
      **Example:** `4`
    * **KEY\_VALUE\_STORE\_READS** integer | null nullable\
      **Example:** `5`
    * **KEY\_VALUE\_STORE\_WRITES** integer | null nullable\
      **Example:** `3`
    * **KEY\_VALUE\_STORE\_LISTS** integer | null nullable\
      **Example:** `5`
    * **REQUEST\_QUEUE\_READS** integer | null nullable\
      **Example:** `2`
    * **REQUEST\_QUEUE\_WRITES** integer | null nullable\
      **Example:** `1`
    * **DATA\_TRANSFER\_INTERNAL\_GBYTES** number | null nullable\
      **Example:** `1`
    * **DATA\_TRANSFER\_EXTERNAL\_GBYTES** number | null nullable\
      **Example:** `3`
    * **PROXY\_RESIDENTIAL\_TRANSFER\_GBYTES** number | null nullable\
      **Example:** `34`
    * **PROXY\_SERPS** integer | null nullable\
      **Example:** `3`

  * **usageTotalUsd** number | null nullable

    Total cost in USD for this run. Represents what you actually pay. For run owners: includes platform usage (compute units) and/or event costs depending on the Actor's pricing model. For run non-owners: only available for Pay-Per-Event Actors (event costs only). Not available for Pay-Per-Result Actors when you're not the Actor owner.

    **Example:** `0.2654`

  * **usageUsd** object

    Platform usage costs breakdown in USD. Only present if you own the run AND are paying for platform usage (Pay-Per-Usage, Rental, or Pay-Per-Event with usage costs like standby Actors). Not available for standard Pay-Per-Event Actors or Pay-Per-Result Actors owned by others.

    * anyOf
      * RunUsageUsd
      * null
      **ACTOR\_COMPUTE\_UNITS** number | null nullable\
      **Example:** `0.0003`
    * **DATASET\_READS** number | null nullable\
      **Example:** `0.0001`
    * **DATASET\_WRITES** number | null nullable\
      **Example:** `0.0001`
    * **KEY\_VALUE\_STORE\_READS** number | null nullable\
      **Example:** `0.0001`
    * **KEY\_VALUE\_STORE\_WRITES** number | null nullable\
      **Example:** `0.00005`
    * **KEY\_VALUE\_STORE\_LISTS** number | null nullable\
      **Example:** `0.0001`
    * **REQUEST\_QUEUE\_READS** number | null nullable\
      **Example:** `0.0001`
    * **REQUEST\_QUEUE\_WRITES** number | null nullable\
      **Example:** `0.0001`
    * **DATA\_TRANSFER\_INTERNAL\_GBYTES** number | null nullable\
      **Example:** `0.001`
    * **DATA\_TRANSFER\_EXTERNAL\_GBYTES** number | null nullable\
      **Example:** `0.003`
    * **PROXY\_RESIDENTIAL\_TRANSFER\_GBYTES** number | null nullable\
      **Example:** `0.034`
    * **PROXY\_SERPS** number | null nullable\
      **Example:** `0.003`

  * **metamorphs** object

    List of metamorph events that occurred during the run.

    * anyOf

      * object\[]
      * null

      **createdAt** string\<date-time> required

      Time when the metamorph occurred.

      **Example:** `2019-11-30T07:39:24.202Z`

    * **actorId** string required

      ID of the Actor that the run was metamorphed to.

      **Example:** `nspoEjklmnsF2oosD`

    * **buildId** string required

      ID of the build used for the metamorphed Actor.

      **Example:** `ME6oKecqy5kXDS4KQ`

    * **inputKey** string | null nullable

      Key of the input record in the key-value store.

      **Example:** `INPUT-METAMORPH-1`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource was not found.


```
{
  "error": {
    "type": "actor-not-found",
    "message": "Actor was not found"
  }
}
```


**Schema**

* oneOf

  * ActorNotFoundError
  * ActorRunNotFoundError

  **error** object

  * **type** string

    **Possible values:** \[`actor-not-found`]

  * **message** string\
    **Example:** `Actor was not found`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Get list of datasets


```
GET 
https://api.apify.com/v2/datasets
```


Lists all of a user's datasets.

The response is a JSON array of objects, where each object contains basic information about one dataset.

By default, the objects are sorted by the `createdAt` field in ascending order, therefore you can use pagination to incrementally fetch all datasets while new ones are still being created. To sort them in descending order, use `desc=1` parameter. The endpoint supports pagination using `limit` and `offset` parameters and it will not return more than 1000 array elements.

## Request

### Query Parameters

* **offset** double

  Number of items that should be skipped at the start. The default value is `0`.

  **Example:** `0`

  **limit** double

  Maximum number of items to return. The default value as well as the maximum is `1000`.

  **Example:** `1000`

  **desc** boolean

  If `true` or `1` then the objects are sorted by the `createdAt` field in descending order. By default, they are sorted in ascending order.

  **Example:** `true`

  **unnamed** boolean

  If `true` or `1` then all the storages are returned. By default, only named storages are returned.

  **Example:** `true`

  **ownership** StorageOwnership

  **Possible values:** \[`ownedByMe`, `sharedWithMe`]

  Filter by ownership. If this parameter is omitted, all accessible datasets are returned.
  * `ownedByMe`: Return only datasets owned by the user.
  * `sharedWithMe`: Return only datasets shared with the user by other users.
  **Example:** `ownedByMe`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "total": 1,
    "offset": 0,
    "limit": 1000,
    "desc": false,
    "count": 1,
    "items": [
      {
        "id": "WkzbQMuFYuamGv3YF",
        "name": "d7b9MDYsbtX5L7XAj",
        "userId": "tbXmWu7GCxnyYtSiL",
        "createdAt": "2019-12-12T07:34:14.202Z",
        "modifiedAt": "2019-12-13T08:36:13.202Z",
        "accessedAt": "2019-12-14T08:36:13.202Z",
        "itemCount": 7,
        "cleanItemCount": 5,
        "actId": "zdc3Pyhyz3m8vjDeM",
        "actRunId": "HG7ML7M8z78YcAPEB"
      }
    ]
  }
}
```


**Schema**

* **data** object required

  Common pagination fields for list responses.

  * **total** integer required

    The total number of items available across all pages.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **offset** integer required

    The starting position for this page of results.

    **Possible values:** `>= 0`

    **Example:** `0`

  * **limit** integer required

    The maximum number of items returned per page.

    **Possible values:** `>= 1`

    **Example:** `1000`

  * **desc** boolean required

    Whether the results are sorted in descending order.

    **Example:** `false`

  * **count** integer required

    The number of items returned in this response.

    **Possible values:** `>= 0`

    **Example:** `1`

  * **items** object\[] required

    * **id** string required\
      **Example:** `WkzbQMuFYuamGv3YF`
    * **name** string required\
      **Example:** `d7b9MDYsbtX5L7XAj`
    * **userId** string required\
      **Example:** `tbXmWu7GCxnyYtSiL`
    * **createdAt** string\<date-time> required\
      **Example:** `2019-12-12T07:34:14.202Z`
    * **modifiedAt** string\<date-time> required\
      **Example:** `2019-12-13T08:36:13.202Z`
    * **accessedAt** string\<date-time> required\
      **Example:** `2019-12-14T08:36:13.202Z`
    * **itemCount** integer required\
      **Example:** `7`
    * **cleanItemCount** integer required\
      **Example:** `5`
    * **actId** string | null nullable\
      **Example:** `zdc3Pyhyz3m8vjDeM`
    * **actRunId** string | null nullable\
      **Example:** `HG7ML7M8z78YcAPEB`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Create dataset


```
POST 
https://api.apify.com/v2/datasets
```


Creates a dataset and returns its object. Keep in mind that data stored under unnamed dataset follows [data retention period](https://docs.apify.com/platform/storage#data-retention). It creates a dataset with the given name if the parameter name is used. If a dataset with the given name already exists then returns its object.

## Request

### Query Parameters

* **name** string

  Custom unique name to easily identify the dataset in the future.

  **Example:** `eshop-items`

<!-- -->

### Status 201

**Response Headers**

* **Location**


```
{
  "data": {
    "id": "WkzbQMuFYuamGv3YF",
    "name": "d7b9MDYsbtX5L7XAj",
    "userId": "wRsJZtadYvn4mBZmm",
    "createdAt": "2019-12-12T07:34:14.202Z",
    "modifiedAt": "2019-12-13T08:36:13.202Z",
    "accessedAt": "2019-12-14T08:36:13.202Z",
    "itemCount": 7,
    "cleanItemCount": 5,
    "actId": "string",
    "actRunId": "string",
    "fields": "Unknown Type: array,null",
    "schema": {
      "actorSpecification": 1,
      "title": "My dataset",
      "views": {
        "overview": {
          "title": "Overview",
          "transformation": {
            "fields": [
              "linkUrl"
            ]
          },
          "display": {
            "component": "table",
            "properties": {
              "linkUrl": {
                "label": "Link URL",
                "format": "link"
              }
            }
          }
        }
      }
    },
    "consoleUrl": "https://console.apify.com/storage/datasets/27TmTznX9YPeAYhkC",
    "itemsPublicUrl": "https://api.apify.com/v2/datasets/WkzbQMuFYuamGv3YF/items?signature=abc123",
    "urlSigningSecretKey": "string",
    "generalAccess": "RESTRICTED",
    "stats": {
      "readCount": 22,
      "writeCount": 3,
      "storageBytes": 783
    }
  }
}
```


**Schema**

* **data** object required

  * **id** string required\
    **Example:** `WkzbQMuFYuamGv3YF`

  * **name** string | null nullable\
    **Example:** `d7b9MDYsbtX5L7XAj`

  * **userId** string required\
    **Example:** `wRsJZtadYvn4mBZmm`

  * **createdAt** string\<date-time> required\
    **Example:** `2019-12-12T07:34:14.202Z`

  * **modifiedAt** string\<date-time> required\
    **Example:** `2019-12-13T08:36:13.202Z`

  * **accessedAt** string\<date-time> required\
    **Example:** `2019-12-14T08:36:13.202Z`

  * **itemCount** integer required

    **Possible values:** `>= 0`

    **Example:** `7`

  * **cleanItemCount** integer required

    **Possible values:** `>= 0`

    **Example:** `5`

  * **actId** string | null nullable

  * **actRunId** string | null nullable

  * **fields** string\[] nullable

  * **schema** object | null nullable

    Defines the schema of items in your dataset, the full specification can be found in [Apify docs](https://docs.apify.com/platform/actors/development/actor-definition/dataset-schema.md)

    **Example:** `{"actorSpecification":1,"title":"My dataset","views":{"overview":{"title":"Overview","transformation":{"fields":["linkUrl"]},"display":{"component":"table","properties":{"linkUrl":{"label":"Link URL","format":"link"}}}}}}`

  * **consoleUrl** string\<uri> required\
    **Example:** `https://console.apify.com/storage/datasets/27TmTznX9YPeAYhkC`

  * **itemsPublicUrl** string\<uri>

    A public link to access the dataset items directly.

    **Example:** `https://api.apify.com/v2/datasets/WkzbQMuFYuamGv3YF/items?signature=abc123`

  * **urlSigningSecretKey** string | null nullable

    A secret key for generating signed public URLs. It is only provided to clients with WRITE permission for the dataset.

  * **generalAccess** GeneralAccess (string)

    Defines the general access level for the resource.

    **Possible values:** \[`ANYONE_WITH_ID_CAN_READ`, `ANYONE_WITH_NAME_CAN_READ`, `FOLLOW_USER_SETTING`, `RESTRICTED`]

    **Example:** `RESTRICTED`

  * **stats** object

    * **readCount** integer required\
      **Example:** `22`
    * **writeCount** integer required\
      **Example:** `3`
    * **storageBytes** integer required\
      **Example:** `783`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Get log


```
GET 
https://api.apify.com/v2/logs/:buildOrRunId
```


Retrieves logs for a specific Actor build or run.

## Request

### Path Parameters

* **buildOrRunId** string required

  ID of the Actor build or run.

  **Example:** `HG7ML7M8z78YcAPEB`

### Query Parameters

* **stream** boolean

  If `true` or `1` then the logs will be streamed as long as the run or build is running.

  **Example:** `false`

  **download** boolean

  If `true` or `1` then the web browser will download the log file rather than open it in a tab.

  **Example:** `false`

  **raw** boolean

  If `true` or `1`, the logs will be kept verbatim. By default, the API removes ANSI escape codes from the logs, keeping only printable characters.

  **Example:** `false`

<!-- -->

### Status 200

**Response Headers**




```
2017-07-14T06:00:49.733Z Application started.
2017-07-14T06:00:49.741Z Input: { test: 123 }
2017-07-14T06:00:49.752Z Some useful debug information follows.
```


**Schema**

* **string** string\
  **Example:** `2017-07-14T06:00:49.733Z Application started. 2017-07-14T06:00:49.741Z Input: { test: 123 } 2017-07-14T06:00:49.752Z Some useful debug information follows.`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 404

Not found - the requested resource does not exist.


```
{
  "error": {
    "type": "record-not-found",
    "message": "The requested resource was not found."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Get private user data


```
GET 
https://api.apify.com/v2/users/me
```


Returns information about the current user account, including both public and private information.

The user account is identified by the provided authentication token.

The fields `plan`, `email` and `profile` are omitted when this endpoint is accessed from Actor run.

<!-- -->

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "id": "YiKoxjkaS9gjGTqhF",
    "username": "myusername",
    "profile": {
      "bio": "I started web scraping in 1985 using Altair BASIC.",
      "name": "Jane Doe",
      "pictureUrl": "https://apify.com/img/anonymous_user_picture.png",
      "githubUsername": "torvalds.",
      "websiteUrl": "http://www.example.com",
      "twitterUsername": "@BillGates"
    },
    "email": "bob@example.com",
    "proxy": {
      "password": "ad78knd9Jkjd86",
      "groups": [
        {
          "name": "Group1",
          "description": "Group1 description",
          "availableCount": 10
        }
      ]
    },
    "plan": {
      "id": "Personal",
      "description": "Cost-effective plan for freelancers, developers and students.",
      "isEnabled": true,
      "monthlyBasePriceUsd": 49,
      "monthlyUsageCreditsUsd": 49,
      "usageDiscountPercent": 0,
      "enabledPlatformFeatures": [
        "ACTORS",
        "STORAGE",
        "PROXY_SERPS",
        "SCHEDULER",
        "WEBHOOKS"
      ],
      "maxMonthlyUsageUsd": 9999,
      "maxActorMemoryGbytes": 32,
      "maxMonthlyActorComputeUnits": 1000,
      "maxMonthlyResidentialProxyGbytes": 10,
      "maxMonthlyProxySerps": 30000,
      "maxMonthlyExternalDataTransferGbytes": 1000,
      "maxActorCount": 100,
      "maxActorTaskCount": 1000,
      "dataRetentionDays": 14,
      "availableProxyGroups": {
        "RESIDENTIAL": 1000,
        "DATACENTER": 500,
        "GOOGLE_SERP": 200
      },
      "teamAccountSeatCount": 1,
      "supportLevel": "COMMUNITY",
      "availableAddOns": []
    },
    "effectivePlatformFeatures": {
      "ACTORS": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "STORAGE": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "SCHEDULER": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "PROXY": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "PROXY_EXTERNAL_ACCESS": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "PROXY_RESIDENTIAL": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "PROXY_SERPS": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "WEBHOOKS": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "ACTORS_PUBLIC_ALL": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      },
      "ACTORS_PUBLIC_DEVELOPER": {
        "isEnabled": true,
        "disabledReason": "The \"Selected public Actors for developers\" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com",
        "disabledReasonType": "DISABLED",
        "isTrial": false,
        "trialExpirationAt": "2025-01-01T14:00:00.000Z"
      }
    },
    "createdAt": "2022-11-29T14:48:29.381Z",
    "isPaying": true
  }
}
```


**Schema**

* **data** object required

  * **id** string required\
    **Example:** `YiKoxjkaS9gjGTqhF`

  * **username** string required\
    **Example:** `myusername`

  * **profile** object required

    * **bio** string\
      **Example:** `I started web scraping in 1985 using Altair BASIC.`
    * **name** string\
      **Example:** `Jane Doe`
    * **pictureUrl** string\<uri>\
      **Example:** `https://apify.com/img/anonymous_user_picture.png`
    * **githubUsername** string\
      **Example:** `torvalds.`
    * **websiteUrl** string\<uri>\
      **Example:** `http://www.example.com`
    * **twitterUsername** string\
      **Example:** `@BillGates`

  * **email** string\<email> required\
    **Example:** `bob@example.com`

  * **proxy** object required

    * **password** string required\
      **Example:** `ad78knd9Jkjd86`

    * **groups** object\[] required

      * **name** string required\
        **Example:** `Group1`
      * **description** string required\
        **Example:** `Group1 description`
      * **availableCount** integer required\
        **Example:** `10`

  * **plan** object required

    * **id** string required\
      **Example:** `Personal`

    * **description** string required\
      **Example:** `Cost-effective plan for freelancers, developers and students.`

    * **isEnabled** boolean required\
      **Example:** `true`

    * **monthlyBasePriceUsd** number required\
      **Example:** `49`

    * **monthlyUsageCreditsUsd** number required\
      **Example:** `49`

    * **usageDiscountPercent** number\
      **Example:** `0`

    * **enabledPlatformFeatures** string\[] required\
      **Example:** `["ACTORS","STORAGE","PROXY_SERPS","SCHEDULER","WEBHOOKS"]`

    * **maxMonthlyUsageUsd** number required\
      **Example:** `9999`

    * **maxActorMemoryGbytes** number required\
      **Example:** `32`

    * **maxMonthlyActorComputeUnits** number required\
      **Example:** `1000`

    * **maxMonthlyResidentialProxyGbytes** number required\
      **Example:** `10`

    * **maxMonthlyProxySerps** integer required\
      **Example:** `30000`

    * **maxMonthlyExternalDataTransferGbytes** number required\
      **Example:** `1000`

    * **maxActorCount** integer required\
      **Example:** `100`

    * **maxActorTaskCount** integer required\
      **Example:** `1000`

    * **dataRetentionDays** integer required\
      **Example:** `14`

    * **availableProxyGroups** object required

      A dictionary mapping proxy group names to the number of available proxies in each group. The keys are proxy group names (e.g., "RESIDENTIAL", "DATACENTER") and values are the count of available proxies.

      * **property name\*** integer

        The number of available proxies in this group.

    * **teamAccountSeatCount** integer required\
      **Example:** `1`

    * **supportLevel** string required\
      **Example:** `COMMUNITY`

    * **availableAddOns** string\[] required\
      **Example:** `[]`

  * **effectivePlatformFeatures** object required

    * **ACTORS** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **STORAGE** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **SCHEDULER** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **PROXY** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **PROXY\_EXTERNAL\_ACCESS** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **PROXY\_RESIDENTIAL** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **PROXY\_SERPS** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **WEBHOOKS** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **ACTORS\_PUBLIC\_ALL** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

    * **ACTORS\_PUBLIC\_DEVELOPER** object required

      * **isEnabled** boolean required\
        **Example:** `true`
      * **disabledReason** string | null nullable required\
        **Example:** `The "Selected public Actors for developers" feature is not enabled for your account. Please upgrade your plan or contact support@apify.com`
      * **disabledReasonType** string | null nullable required\
        **Example:** `DISABLED`
      * **isTrial** boolean required\
        **Example:** `false`
      * **trialExpirationAt** string,null\<date-time> nullable required\
        **Example:** `2025-01-01T14:00:00.000Z`

  * **createdAt** string\<date-time> required\
    **Example:** `2022-11-29T14:48:29.381Z`

  * **isPaying** boolean required\
    **Example:** `true`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`
# Get monthly usage


```
GET 
https://api.apify.com/v2/users/me/usage/monthly
```


Returns a complete summary of your usage for the current usage cycle, an overall sum, as well as a daily breakdown of usage. It is the same information you will see on your account's [Billing page](https://console.apify.com/billing#/usage). The information includes your use of storage, data transfer, and request queue usage.

Using the `date` parameter will show your usage in the usage cycle that includes that date.

## Request

### Query Parameters

* **date** string

  Date in the YYYY-MM-DD format.

  **Example:** `2020-06-14`

<!-- -->

### Status 200

**Response Headers**




```
{
  "data": {
    "usageCycle": {
      "startAt": "2022-10-02T00:00:00.000Z",
      "endAt": "2022-11-01T23:59:59.999Z"
    },
    "monthlyServiceUsage": {},
    "dailyServiceUsages": [
      {
        "date": "2022-10-02T00:00:00.000Z",
        "serviceUsage": {
          "ACTOR_COMPUTE_UNITS": {
            "quantity": 60,
            "baseAmountUsd": 0.00030000000000000003,
            "baseUnitPriceUsd": 0.000005,
            "amountAfterVolumeDiscountUsd": 0.00030000000000000003,
            "priceTiers": []
          }
        },
        "totalUsageCreditsUsd": 0.0474385791970591
      }
    ],
    "totalUsageCreditsUsdBeforeVolumeDiscount": 0.786143673840067,
    "totalUsageCreditsUsdAfterVolumeDiscount": 0.786143673840067
  }
}
```


**Schema**

* **data** object required

  * **usageCycle** object required

    * **startAt** string\<date-time> required\
      **Example:** `2022-10-02T00:00:00.000Z`
    * **endAt** string\<date-time> required\
      **Example:** `2022-11-01T23:59:59.999Z`

  * **monthlyServiceUsage** object required

    A map of usage item names (e.g., ACTOR\_COMPUTE\_UNITS) to their usage details.

    * **property name\*** UsageItem

      * **quantity** number required\
        **Example:** `2.784475`

      * **baseAmountUsd** number required\
        **Example:** `0.69611875`

      * **baseUnitPriceUsd** number\
        **Example:** `0.25`

      * **amountAfterVolumeDiscountUsd** number\
        **Example:** `0.69611875`

      * **priceTiers** object\[]

        * **quantityAbove** number required\
          **Example:** `0`
        * **discountPercent** number required\
          **Example:** `100`
        * **tierQuantity** number required\
          **Example:** `0.39`
        * **unitPriceUsd** number required\
          **Example:** `0`
        * **priceUsd** number required\
          **Example:** `0`

  * **dailyServiceUsages** object\[] required

    * **date** string required\
      **Example:** `2022-10-02T00:00:00.000Z`

    * **serviceUsage** object required

      A map of service usage item names to their usage details.

      * **property name\*** UsageItem

        * **quantity** number required\
          **Example:** `2.784475`

        * **baseAmountUsd** number required\
          **Example:** `0.69611875`

        * **baseUnitPriceUsd** number\
          **Example:** `0.25`

        * **amountAfterVolumeDiscountUsd** number\
          **Example:** `0.69611875`

        * **priceTiers** object\[]

          * **quantityAbove** number required\
            **Example:** `0`
          * **discountPercent** number required\
            **Example:** `100`
          * **tierQuantity** number required\
            **Example:** `0.39`
          * **unitPriceUsd** number required\
            **Example:** `0`
          * **priceUsd** number required\
            **Example:** `0`

    * **totalUsageCreditsUsd** number required\
      **Example:** `0.0474385791970591`

  * **totalUsageCreditsUsdBeforeVolumeDiscount** number required\
    **Example:** `0.786143673840067`

  * **totalUsageCreditsUsdAfterVolumeDiscount** number required\
    **Example:** `0.786143673840067`

### Status 400

Bad request - invalid input parameters or request body.


```
{
  "error": {
    "type": "invalid-input",
    "message": "Invalid input: The request body contains invalid data."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 401

Unauthorized - authentication required or invalid token.


```
{
  "error": {
    "type": "token-not-valid",
    "message": "Authentication token is not valid."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 403

Forbidden - insufficient permissions to perform this action.


```
{
  "error": {
    "type": "permission-denied",
    "message": "You do not have permission to perform this action."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 405

Method not allowed.


```
{
  "error": {
    "type": "method-not-allowed",
    "message": "This API end-point can only be accessed using the following HTTP methods: OPTIONS,GET"
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`

### Status 429

Too many requests - rate limit exceeded.


```
{
  "error": {
    "type": "rate-limit-exceeded",
    "message": "You have exceeded the rate limit. Please try again later."
  }
}
```


**Schema**

* **error** object required

  * **type** string required\
    **Example:** `run-failed`
  * **message** string required\
    **Example:** `Actor run did not succeed (run ID: 55uatRrZib4xbZs, status: FAILED)`


