import ReceivingTablo from "../components/ReceivingTable";
import ProcessingTable from "../components/ProcessingTable";
import WarehouseOccupancyTable from "../components/WarehouseOccupancyTable";
import CorridorTable from "../components/CorridorTable";
import ShelfTable from "../components/ShelfTable";
import TotalTable from "../components/TotalTable";

// BU SAYFA DASHBOARD VE ANASAYFADIR.

export default function Dashboard() {
    return (
        <div className="p-4">
            {/* Masonry-style columns so cards keep natural heights */}
            <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
                <div className="break-inside-avoid mb-4 space-y-4">
                    <ReceivingTablo />
                    <CorridorTable />

                </div>
                <div className="break-inside-avoid mb-4 space-y-4">
                    <ProcessingTable />
                    <ShelfTable />

                </div>
                {/* Right column stack: warehouse overall then corridor bars */}
                <div className="break-inside-avoid mb-4 space-y-4">
                    <TotalTable />
                    <WarehouseOccupancyTable />


                </div>
            </div>
        </div>
    );
}
