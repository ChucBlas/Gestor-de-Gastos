import { useState } from "react";
import { FinanceDonutChart } from "./PieChart";
import { CategorySummary } from "../../../services/types";

interface CardPieChartProps {
    balance: number,
    categories: CategorySummary[],
    title: string,
}

export function CardPieChart({ balance, categories, title }: CardPieChartProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="card">
                    <div className="card-header">
                        <div className="card-title">{title}</div>
                        <div>
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                    {isOpen && (
                        <div style={{margin: "10px"}}>
                            <FinanceDonutChart
                                categories={categories}
                                totalValue={balance}
                            />
                        </div>
                    )}
                </div>
        </>
    )
}