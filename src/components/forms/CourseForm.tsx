import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CourseFormProps {
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onClose }) => {
  const { addCourse } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    targetAudience: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.duration) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addCourse(formData);
      toast({ title: 'Success', description: 'Course added successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add course', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">Add Course</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter course title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter course description"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="e.g., 4 weeks, 2 months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Audience</Label>
              <Input
                id="target"
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                placeholder="e.g., Beginners, Youth, Adults"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500">
              Add Course
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;