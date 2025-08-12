import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface MEReportFormProps {
  onClose: () => void;
}

const MEReportForm: React.FC<MEReportFormProps> = ({ onClose }) => {
  const { addMEReport, centres } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    centre_name: '',
    technical_manager_name: '',
    month: '',
    year: new Date().getFullYear().toString(),
    comments: '',
    total_enrollment: '',
    total_completion: '',
    total_dropout: '',
    employment_rate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.centre_name || !formData.technical_manager_name || !formData.month) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addMEReport({
        centre_name: formData.centre_name,
        technical_manager_name: formData.technical_manager_name,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        comments: formData.comments,
        total_enrollment: parseInt(formData.total_enrollment) || 0,
        total_completion: parseInt(formData.total_completion) || 0,
        total_dropout: parseInt(formData.total_dropout) || 0,
        employment_rate: parseFloat(formData.employment_rate) || 0,
      });
      toast({ title: 'Success', description: 'M&E report submitted successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit M&E report', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const availableCentres = centres.map(centre => centre.centre_name);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-auto shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Submit M&E Report</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="centre_name">Centre Name *</Label>
                <Select value={formData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="technical_manager_name">Technical Manager Name *</Label>
                <Input
                  id="technical_manager_name"
                  value={formData.technical_manager_name}
                  onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                  placeholder="Enter technical manager name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="month">Month *</Label>
                <Select value={formData.month} onValueChange={(value) => handleChange('month', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Enter year"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="total_enrollment">Total Enrollment</Label>
                <Input
                  id="total_enrollment"
                  type="number"
                  value={formData.total_enrollment}
                  onChange={(e) => handleChange('total_enrollment', e.target.value)}
                  placeholder="Enter total enrollment"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="total_completion">Total Completion</Label>
                <Input
                  id="total_completion"
                  type="number"
                  value={formData.total_completion}
                  onChange={(e) => handleChange('total_completion', e.target.value)}
                  placeholder="Enter total completion"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="total_dropout">Total Dropout</Label>
                <Input
                  id="total_dropout"
                  type="number"
                  value={formData.total_dropout}
                  onChange={(e) => handleChange('total_dropout', e.target.value)}
                  placeholder="Enter total dropout"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="employment_rate">Employment Rate (%)</Label>
                <Input
                  id="employment_rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.employment_rate}
                  onChange={(e) => handleChange('employment_rate', e.target.value)}
                  placeholder="Enter employment rate percentage"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
                placeholder="Enter any additional comments, observations, or recommendations..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit M&E Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MEReportForm;
