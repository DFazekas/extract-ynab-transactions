# Getting Started

## Environment Variables

Create a file titled **.env.yaml**. Paste the following structure in the file, and replace the placeholders with your own values.

```yaml
YNAB_ACCESS_TOKEN: { ynab_api-key }
BUDGET_ID: { ynab_budget-id }
```

Where:

- `ynab_api-key` specifies the YNAB account.
- `ynab_budget-id` specifies the individual budget to read.

### Notes

- Google Cloud Functions only supports attaching `.yaml` formatted environment variables when deploying.
- The package to export (aka. expose) the environment variables locally does not support YAML encoding, so they're first converted into a JSON format.

# Developing Locally

Google Cloud Functions provides you a framework for developing locally, reducing how frequently you need to deploy.

## Local Hosting

First, navigate to the root of the cloud function (i.e., alongside _package.json_), then run the command `npm run start`. This will do several things:

1. Expose your environment variables. It copies them from the **.env.yaml** file into the **.env.json** file (due to the aforementioned package limitations).
2. Spin-up a local server that hosts the individual cloud function.

### Notes

- Exposing environment variables is necessary because the code `process.env.{env-name}` will not know where to find them.
- There used to be a `npm run watch` script that watched for changes and reloaded the server accordingly, but there is a conflict with the environment variable injector (which took priority).

## Triggering Local Function

Using a tool such as Postman, paste the local function address as a **POST** request with the following body (in JSON):

```JSON
{
    "since_date": "2021-12-20"
}
```

### Authentication

You must be logged into gCloud with an account within the same project as the cloud function, and have cloud function invoker permissions.

To log into gCloud, use the following command: `gcloud auth login`.

### Reloading

The server will **not** hot-reload, so you're required to shutdown (`CTRL-C`) and restart the server (`npm run start`) everytime you want to view new changes.

# How to Deploy

Once you're ready to push your code to the Google Cloud Project, run the following command: `npm run deploy`. This will do several things:

1. Upload the environment variables from the **.env.yaml** file into the virtual machine hosting the cloud function.
2. Deploy the cloud function to a virtual machine.

# Future Work

## Generalized YNAB Categories

At the moment, there are exactly three categories of interest and have been hard-coded in the **constants.js** file, named `sharedExpenseCategories`. These include "rent", "hydro", and "internet".

It would be nice to generalize the categories; to identify a future-proof pattern that would eliminate the need to re-deploy the functions when new categories are of relevence. Or, at the very least, extract these categories from the source code, to create a better separation of concern.
