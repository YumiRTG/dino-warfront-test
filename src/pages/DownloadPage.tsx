import ApkDownload from '@/sections/ApkDownload'
import { usePageMotion } from '@/hooks/useMotion'

export default function DownloadPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell px-4">
      <div data-reveal="scale">
        <ApkDownload />
      </div>
    </div>
  )
}
