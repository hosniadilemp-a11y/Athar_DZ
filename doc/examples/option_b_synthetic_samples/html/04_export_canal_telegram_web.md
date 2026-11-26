# Ground Truth — `04_export_canal_telegram_web.html`

> Export HTML statique d'un canal Telegram Web P2P crypto fictif (messages, wallets BTC/TRC20, RIP, Blida/Boufarik).

## Metadata

- **title**: `Export Telegram Web — @p2p_dz_fictif`
- **lang**: `fr`
- **canonical_url**: ``
- **embedded_images**: `0`
- **forms_count**: `0`
- **scripts_count**: `0`
- **json_ld_blocks**: `0`
- **comments_count**: `0`
- **locations**: `Blida; Boufarik`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `canal_telegram` | `@p2p_dz_fictif` | @p2p_dz_fictif | `head:meta` | `quick` | Canal Telegram exporté |
| `site_web` | `https://p2p-escrow-fictif.example.org/order/99` | https://p2p-escrow-fictif.example.org/order/99 | `body:text` | `quick` | Lien escrow frauduleux |
| `compte_bancaire` | `00799999001122334455` | RIP 00799999001122334455 | `body:text` | `quick` | RIP de collecte DZD |
| `crypto_wallet` | `TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE` | TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE | `body:text` | `quick` | Wallet TRON TRC-20 |
| `crypto_wallet` | `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh` | bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh | `body:text` | `quick` | Wallet Bitcoin Bech32 |
| `telephone` | `+2135550148` | +2135550148 | `body:text` | `quick` | Téléphone de contact |
| `telephone` | `+213661550188` | +213661550188 | `body:text` | `quick` | Téléphone admin (recoupement PDF 04) |
| `compte_social` | `@walid_change_dz` | @walid_change_dz | `body:text` | `step_by_step` | Administrateur canal (Stage 2) |
| `personne` | `Walid Cherif` | Walid Cherif | `body:text` | `step_by_step` | Admin identifié (recoupement PDF 04) |
| `transaction_financiere` | `320000 DZD` | 320000 DZD | `body:text` | `step_by_step` | Montant transaction P2P (Stage 2) |
| `message_chat` | `msg-401` | Message #msg-401 (@walid_change_dz) | `body:message#0` | `step_by_step` | Message Telegram 1 (Stage 3) |
| `message_chat` | `msg-402` | Message #msg-402 (@walid_change_dz) | `body:message#1` | `step_by_step` | Message Telegram 2 (Stage 3) |

## Expected Relations

| relation_type | source_type | source_value | target_type | target_value | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `UTILISE_TELEPHONE` | `personne` | `Walid Cherif` | `telephone` | `+213661550188` | `step_by_step` | Admin canal -> téléphone |
| `HEBERGE_MESSAGES` | `canal_telegram` | `@p2p_dz_fictif` | `message_chat` | `msg-401` | `step_by_step` | Canal -> message-401 |
| `HEBERGE_MESSAGES` | `canal_telegram` | `@p2p_dz_fictif` | `message_chat` | `msg-402` | `step_by_step` | Canal -> message-402 |
