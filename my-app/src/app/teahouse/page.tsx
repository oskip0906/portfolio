import { getRoomPayload } from "@/lib/get-room-payload"
import RoomExperience from "../components/room/room-experience"

export default async function TeahousePage() {
  const payload = await getRoomPayload()

  return (
    <div className="w-full">
      <RoomExperience payload={payload} />
    </div>
  )
}
