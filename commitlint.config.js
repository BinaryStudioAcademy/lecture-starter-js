const COMMIT_MODIFIERS = ['+', '*', '-'];
const COMMIT_MESSAGE_REGEXP = new RegExp(`([${COMMIT_MODIFIERS.join(',')}]) (.*\\S)$`);
const COMMIT_MESSAGE_MATCH_RULE_MESSAGE = `
Commit message doesn't match format requirements
Commit message must have one of the following formats:
    - <modifier> <description>
Where:
    - <modifier>: ${COMMIT_MODIFIERS.join(', ')}
Examples:
    - + container
    - - unused code
`;

const configuration = {
    parserPreset: {
        parserOpts: {
            headerPattern: COMMIT_MESSAGE_REGEXP,
            headerCorrespondence: ['modifier', 'description']
        }
    },
    defaultIgnores: true,
    plugins: [
        {
            rules: {
                'commit-message-match': ({ header }) => {
                    if (!COMMIT_MESSAGE_REGEXP.test(header)) {
                        return [false, COMMIT_MESSAGE_MATCH_RULE_MESSAGE];
                    }

                    return [true];
                }
            }
        }
    ],
    rules: {
        'commit-message-match': [2, 'always']
    }
};

export default configuration;
