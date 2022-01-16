use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Secrets {
    #[serde(rename = "oc-key")]
    pub oc_key: String,
    #[serde(rename = "owm-key")]
    pub owm_key: String,
}
