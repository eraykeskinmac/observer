## Data Streaming Validation

To verify that data is being correctly sent to ClickHouse:

1. Ensure your test application is running and sending data.
2. Run the validation script:
   ```
   npm run validate
   ```
3. Check the console output for information about the data in ClickHouse.

The validation script checks:

- If data exists in ClickHouse
- The timestamp of the most recent data
- The different types of spans being recorded

If any issues are detected, the script will provide error messages or warnings.

### Troubleshooting

If the validation fails:

1. Check that your test application is running and configured correctly.
2. Verify that the OpenTelemetry Collector is running and properly configured.
3. Ensure that the ClickHouse connection details in your `.env` file are correct.
4. Review the OpenTelemetry Collector logs for any errors or warnings.

For more detailed diagnostics, you can modify the `validate_data_streaming.js` script in the `tools/script` directory.
