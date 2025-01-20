/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import ReportModal from "components/report-modal";
import DefendantModal from "components/defendant-modal";
import JuryModal from "components/jury-modal";
import ResultsModal from "components/results-modal";
import { ConfigProvider } from "context/config-context";
import "../styles/index.scss";

type Verdict = "won" | "lost";

const App = () => {
    const [openReportModal, setOpenReportModal] = useState(false);
    const [openDefendantModal, setOpenDefendantModal] = useState(false);
    const [openJuryModal, setOpenJuryModal] = useState(false);
    const [openJResultsModal, setOpenResultsModal] = useState(false);

    const [verdict, setVerdict] = useState<Verdict>("won");

    const [token, setToken] = useState(() =>
        JSON.parse(localStorage.getItem("token") || "")
    );

    const [collectionId, setCollectionId] = useState(
        "66a94f2c87c852fef23cc6d4"
    );
    const [issueId, setIssueId] = useState("67124beb43fceaa6d1e4f00f");
    const [fundsAtStake, setFundsAtStake] = useState("$3,000");

    return (
        <ConfigProvider
            config={{
                baseURL: "https://api-devavabuild.chain.site/v1",
                publicKey:
                    "nzTjIkbjIeb19Pm76bAeIrF2sdZRByLjkL8VSJbRrwg6dtUdNZ5ZeOFds9",
                clientId: "812773e0-6d93-4067-bb44-ad9eae2b0ba1",
                token,
                timezone: "America/New_York",
            }}
        >
            <div className="circular-std-regular">
                <div className="ir-flex ir-flex-col ir-items-start ir-gap-2">
                    <div className="ir-mb-5 ir-flex ir-flex-col ir-gap-2">
                        <label>Token</label>
                        <input
                            value={token}
                            type="text"
                            name="token"
                            placeholder="token"
                            className="ir-w-[250px] ir-border ir-border-black"
                            onChange={(e) => {
                                const { value } = e.target;
                                setToken(value);
                                localStorage.setItem(
                                    "token",
                                    JSON.stringify(value)
                                );
                            }}
                        />
                    </div>

                    <div className="ir-mb-5 ir-flex ir-flex-col ir-gap-4">
                        <div className="ir-flex ir-flex-col ir-gap-2">
                            <label>Collection ID</label>
                            <input
                                value={collectionId}
                                type="text"
                                name="collectionId"
                                placeholder="collectionId"
                                className="ir-w-[250px] ir-border ir-border-black"
                                onChange={(e) =>
                                    setCollectionId(e.target.value)
                                }
                            />
                        </div>

                        <div className="ir-flex ir-flex-col ir-gap-2">
                            <label>Funds At Stake (e.g $3,000)</label>
                            <input
                                value={fundsAtStake}
                                type="text"
                                name="fundsAtStake"
                                placeholder="fundsAtStake e.g $4,000"
                                className="ir-border ir-border-black"
                                onChange={(e) =>
                                    setFundsAtStake(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="button"
                            disabled={!(collectionId && fundsAtStake)}
                            onClick={() => setOpenReportModal(true)}
                        >
                            Report Issue
                        </button>
                    </div>

                    <div className="ir-mb-5 ir-flex ir-flex-col ir-gap-4">
                        <div className="ir-flex ir-flex-col ir-gap-2">
                            <label>Issue ID</label>
                            <input
                                value={issueId}
                                type="text"
                                name="issueId"
                                placeholder="issueId"
                                className="ir-w-[250px] ir-border ir-border-black"
                                onChange={(e) => setIssueId(e.target.value)}
                            />
                        </div>

                        <button
                            className="ir-block"
                            type="button"
                            onClick={() => setOpenDefendantModal(true)}
                        >
                            Defend Issue
                        </button>
                    </div>

                    <button
                        className="ir-block"
                        type="button"
                        onClick={() => setOpenJuryModal(true)}
                    >
                        Serve Jury
                    </button>

                    <button
                        className="ir-block"
                        type="button"
                        onClick={() => {
                            setVerdict("lost");
                            setOpenResultsModal(true);
                        }}
                    >
                        You Lost
                    </button>

                    <button
                        className="ir-block"
                        type="button"
                        onClick={() => {
                            setVerdict("won");
                            setOpenResultsModal(true);
                        }}
                    >
                        You Won
                    </button>
                </div>

                <ReportModal
                    {...{
                        collectionId,
                        fundsAtStake,
                        chainsiteName: "AvaBuild",
                        isOpen: openReportModal,
                        onClose: () => setOpenReportModal(false),
                    }}
                />

                <DefendantModal
                    {...{
                        issueId,
                        chainsiteName: "Snowfort",
                        isOpen: openDefendantModal,
                        onClose: () => setOpenDefendantModal(false),
                    }}
                />

                <JuryModal
                    {...{
                        issueId,
                        isOpen: openJuryModal,
                        onClose: () => setOpenJuryModal(false),
                    }}
                />

                <ResultsModal
                    {...{
                        verdict,
                        fundsAmount: "$3,000",
                        chainsiteName: "Snowfort",
                        isOpen: openJResultsModal,
                        onClose: () => setOpenResultsModal(false),
                    }}
                />
            </div>
        </ConfigProvider>
    );
};

export default App;
