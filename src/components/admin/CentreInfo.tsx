import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Building, Users, Zap, Wifi, Fan, Lightbulb, Droplets, Monitor, CheckCircle, XCircle } from 'lucide-react';

const CentreInfo: React.FC = () => {
  const { centres } = useAppContext();

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">Not Available</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Centre Information Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Building className="w-5 h-5 text-blue-600" />
              Total Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">{centres.length}</div>
            <p className="text-sm text-slate-600">Registered centres</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Zap className="w-5 h-5 text-yellow-600" />
              Power Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {centres.filter(c => c.power_available).length}
            </div>
            <p className="text-sm text-slate-600">Centres with power</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Wifi className="w-5 h-5 text-blue-600" />
              Internet Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {centres.filter(c => c.internet_available).length}
            </div>
            <p className="text-sm text-slate-600">Centres with internet</p>
          </CardContent>
        </Card>
      </div>

      {/* Centres Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-800">Centre Information & Infrastructure</CardTitle>
        </CardHeader>
        <CardContent>
          {centres.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No centres registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre Name</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Technical Manager</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Computers</TableHead>
                    <TableHead>Power</TableHead>
                    <TableHead>Internet</TableHead>
                    <TableHead>Lighting</TableHead>
                    <TableHead>Water</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centres.map((centre) => (
                    <TableRow key={centre.id}>
                      <TableCell className="font-medium">{centre.centre_name}</TableCell>
                      <TableCell>{centre.lga}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{centre.technical_manager_name}</div>
                          <div className="text-sm text-slate-500">{centre.technical_manager_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{centre.contact_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">Declared: {centre.declared_capacity}</div>
                          <div className="text-sm text-slate-500">Usable: {centre.usable_capacity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">Present: {centre.computers_present}</div>
                          <div className="text-sm text-slate-500">Functional: {centre.computers_functional}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(centre.power_available)}
                          {getStatusBadge(centre.power_available)}
                        </div>
                        {centre.power_condition && (
                          <div className="text-xs text-slate-500 mt-1">{centre.power_condition}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(centre.internet_available)}
                          {getStatusBadge(centre.internet_available)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(centre.lighting_available)}
                          {getStatusBadge(centre.lighting_available)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(centre.water_functional)}
                          {getStatusBadge(centre.water_functional)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Infrastructure Details */}
      {centres.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Equipment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Total Computers</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {centres.reduce((sum, c) => sum + c.computers_present, 0)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {centres.reduce((sum, c) => sum + c.computers_functional, 0)} functional
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fan className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Total Fans</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {centres.reduce((sum, c) => sum + c.fans_present, 0)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {centres.reduce((sum, c) => sum + c.fans_functional, 0)} functional
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Air Conditioners</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {centres.reduce((sum, c) => sum + c.air_condition_present, 0)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {centres.reduce((sum, c) => sum + c.air_condition_functional, 0)} functional
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Infrastructure Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Power Available</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-600">
                      {centres.filter(c => c.power_available).length}
                    </div>
                    <div className="text-sm text-slate-500">
                      of {centres.length} centres
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Internet Available</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {centres.filter(c => c.internet_available).length}
                    </div>
                    <div className="text-sm text-slate-500">
                      of {centres.length} centres
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Lighting Available</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {centres.filter(c => c.lighting_available).length}
                    </div>
                    <div className="text-sm text-slate-500">
                      of {centres.length} centres
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Water Functional</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {centres.filter(c => c.water_functional).length}
                    </div>
                    <div className="text-sm text-slate-500">
                      of {centres.length} centres
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CentreInfo;
