import { Professional, ScheduleData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ScheduleSummaryProps {
  schedule: ScheduleData
  professionals: Professional[]
}

export default function ScheduleSummary({
  schedule,
  professionals,
}: ScheduleSummaryProps) {
  const professionalCounts: { [key: number]: number } = {}
  professionals.forEach((p) => (professionalCounts[p.id] = 0))

  Object.values(schedule).forEach((professionalId) => {
    if (professionalId !== null && professionalCounts[professionalId] !== undefined) {
      professionalCounts[professionalId]++
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumo da Escala</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profissional</TableHead>
              <TableHead className="text-right">Dias na Escala</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">
                  Nenhum profissional cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              professionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: professional.color }}
                      />
                      {professional.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {professionalCounts[professional.id] || 0}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
